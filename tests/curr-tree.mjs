// The prerequisite tree: what a course sits on, and what sits on it.
import { open, ok, finish, CODE, OUT, FIXTURE } from './curr-lib.mjs';

const { browser, page, errors } = await open({
    plan: { '9-FY': [CODE['Algebra I']] },
    ui: { tab: 'tree', selected: CODE['Calculus AB'], treeRoot: CODE['Calculus AB'] }
});

const tree = () => page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('.curr-node')).map((g) => {
        const rect = g.querySelector('rect');
        return {
            title: g.querySelector('text').textContent,
            sub: g.querySelector('text.sub').textContent,
            y: Number(rect.getAttribute('y')),
            x: Number(rect.getAttribute('x')),
            root: g.classList.contains('root'),
            placed: g.classList.contains('placed')
        };
    });
    return { nodes: nodes, edges: document.querySelectorAll('.curr-edge').length };
});

// 1. The whole chain a course rests on, one layer per step.
const chain = await tree();
const titles = chain.nodes.map(n => n.title).sort();
ok('the tree shows the whole chain',
    JSON.stringify(titles) === JSON.stringify(['Algebra I', 'Algebra II', 'Calculus AB', 'Geometry', 'Pre-Calculus Honors']),
    JSON.stringify(titles));
ok('the course asked about is the root', chain.nodes.filter(n => n.root).length === 1 &&
    chain.nodes.find(n => n.root).title === 'Calculus AB');

// 2. A prerequisite is always drawn above what needs it.
const at = (t) => chain.nodes.find(n => n.title === t);
ok('each prerequisite sits above the course that needs it',
    at('Algebra I').y < at('Geometry').y && at('Geometry').y < at('Algebra II').y &&
    at('Algebra II').y < at('Pre-Calculus Honors').y && at('Pre-Calculus Honors').y < at('Calculus AB').y,
    JSON.stringify(chain.nodes.map(n => n.title + '@' + n.y)));
ok('and every step is drawn as an edge', chain.edges >= 8, chain.edges + ' edge paths');

// 3. What is in the plan says where.
ok('a node already planned says which term it is in',
    /Grade 9 · Full Year/.test(at('Algebra I').sub), at('Algebra I').sub);
ok('and one that is not says so', /not planned/.test(at('Calculus AB').sub), at('Calculus AB').sub);
ok('the planned one is marked', at('Algebra I').placed && !at('Calculus AB').placed);

// 4. What depends on a course, not only what it depends on.
await page.evaluate((code) => currTreeSetRoot(document.querySelector('.curr-node'), code), CODE['Algebra I']);
await page.waitForTimeout(400);
const downward = await tree();
const withDeps = downward.nodes.map(n => n.title);
ok('with dependents on, the courses built on it are shown',
    withDeps.includes('Geometry') && withDeps.includes('Chemistry'), JSON.stringify(withDeps));
ok('and they are drawn below it',
    downward.nodes.find(n => n.title === 'Geometry').y >
    downward.nodes.find(n => n.title === 'Algebra I').y);

await page.uncheck('.curr-tree-bar input[type=checkbox]');
await page.waitForTimeout(400);
const upOnly = await tree();
ok('turning them off leaves only what it rests on',
    upOnly.nodes.length === 1 && upOnly.nodes[0].title === 'Algebra I',
    JSON.stringify(upOnly.nodes.map(n => n.title)));
await page.check('.curr-tree-bar input[type=checkbox]');
await page.waitForTimeout(300);

// 5. Clicking a node moves the tree to it.
await page.evaluate(() => {
    const node = Array.from(document.querySelectorAll('.curr-node'))
        .find(g => g.querySelector('text').textContent === 'Chemistry');
    node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
});
await page.waitForTimeout(400);
const rerooted = await tree();
ok('clicking a node re-roots the tree on it',
    rerooted.nodes.find(n => n.root).title === 'Chemistry',
    JSON.stringify(rerooted.nodes.find(n => n.root)));
ok('and both of its prerequisites are above it',
    rerooted.nodes.some(n => n.title === 'Biology') && rerooted.nodes.some(n => n.title === 'Algebra I'),
    JSON.stringify(rerooted.nodes.map(n => n.title)));

// 6. A course with nothing either side is still a tree of one.
await page.evaluate((code) => currTreeSetRoot(document.querySelector('.curr-node'), code), CODE['Yearbook']);
await page.waitForTimeout(400);
ok('a course with no prerequisites is a tree of one',
    (await tree()).nodes.length === 1, JSON.stringify((await tree()).nodes.map(n => n.title)));

// 7. A guide that names a prerequisite loop must not hang the tool.
const cyclic = {
    courses: [
        { course_code: 'A1', title: 'Alpha', department: 'X', grade_levels: [9], credits: 1,
          semester_offered: 'Full Year', prerequisites: { raw: 'Beta', min_gpa: null, courses: ['Beta'], grade_requirements: [] } },
        { course_code: 'B1', title: 'Beta', department: 'X', grade_levels: [9], credits: 1,
          semester_offered: 'Full Year', prerequisites: { raw: 'Alpha', min_gpa: null, courses: ['Alpha'], grade_requirements: [] } }
    ]
};
// There is a plan on the board, so Load asks before replacing the document it was
// built against: press it, then confirm.
await page.evaluate((doc) => { document.querySelector('.curr-json').value = JSON.stringify(doc); }, cyclic);
const pressLoad = async () => {
    await page.evaluate(() => {
        Array.from(document.querySelectorAll('.curr-source-actions .curr-btn'))
            .find(b => ['Load', 'Replace?'].includes(b.textContent.trim())).click();
    });
    await page.waitForTimeout(400);
};
await pressLoad();
await pressLoad();
await page.waitForTimeout(300);
const loop = await page.evaluate(() => {
    const row = Array.from(document.querySelectorAll('.curr-course'))
        .find(r => r.querySelector('.curr-course-title').textContent === 'Alpha');
    row.click();
    currSetTab(document.querySelector('.curr-tab'), 'tree');
    return Array.from(document.querySelectorAll('.curr-node text')).map(t => t.textContent);
});
await page.waitForTimeout(400);
ok('a prerequisite loop draws both courses and stops', (await tree()).nodes.length === 2,
    JSON.stringify((await tree()).nodes.map(n => n.title)));

await page.screenshot({ path: OUT + '/curr-tree.png' });
await finish(browser, errors);
