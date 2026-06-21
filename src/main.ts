import initKiteSql, { WasmDatabase } from "./kite-sql-web";

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("app root missing");

const assetBase = import.meta.env.BASE_URL;
const logoWhite = `${assetBase}images/kite_sql_dark.png`;

const SQL_EXAMPLES = {
  topContributors: `select * from contributors order by score desc;`,
  averageByTeam: `select team, avg(score) as avg_score from contributors group by team order by avg_score desc;`,
  havingClause: `select team, count(*) as total from contributors group by team having count(*) >= 2 order by total desc;`,
  updateAndView: `update contributors set score = score + 5 where name = 'Ada';
select * from contributors order by score desc;`,
} as const;

const DEFAULT_SQL = SQL_EXAMPLES.topContributors;

const ui = document.createElement("div");
ui.className = "site-shell";
ui.innerHTML = `
  <div class="site-bg"></div>
  <header class="topbar">
    <a class="brand" href="#hero" aria-label="KiteSQL home">
      <img class="logo-img" src="${logoWhite}" alt="KiteSQL logo" />
    </a>
    <nav class="nav">
      <a href="#features">Features</a>
      <a href="#playground">Playground</a>
      <a href="#docs">Docs</a>
      <a href="https://github.com/KipData/KiteSQL" target="_blank" rel="noreferrer">GitHub</a>
    </nav>
  </header>

  <main class="page">
    <section class="hero card" id="hero">
      <div class="hero-main">
        <div class="hero-copy">
          <div class="eyebrow">Embedded relational engine for Rust</div>
          <h1>SQL when you want it. Native Rust APIs when you do not.</h1>
          <p class="hero-text">
            KiteSQL is an embedded relational engine shaped by a simple aesthetic: keep the system lightweight,
            keep the APIs native to Rust, and keep relational features practical enough for real applications.
          </p>
          <p class="hero-text">
            Run SQL directly, map typed models with the built-in ORM, evolve schemas with migrations,
            and expose the same engine in the browser through WebAssembly without dragging in unnecessary infrastructure.
          </p>
          <div class="hero-actions">
            <a class="button primary" href="#playground">Try the wasm playground</a>
            <a class="button" href="https://github.com/KipData/KiteSQL" target="_blank" rel="noreferrer">View on GitHub</a>
          </div>
        </div>
        <div class="hero-points">
          <div class="metric"><strong>Rust-native</strong><span>typed APIs alongside SQL</span></div>
          <div class="metric"><strong>Model-driven</strong><span>ORM, CRUD, migrations, query builder</span></div>
          <div class="metric"><strong>Browser-ready</strong><span>npm wasm package at 0.3.2</span></div>
        </div>
      </div>
      <div class="hero-side">
        <div class="mini-card rust-card">
<pre><code>#[derive(Model)]
#[model(table = "users")]
struct User {
    #[model(primary_key)]
    id: i32,
    #[model(unique, varchar = 128)]
    email: String,
    #[model(index)]
    score: i32,
}

database.migrate::<User>()?;
database.insert_many(users)?;

let rows = database
    .bind(|ctx| {
        ctx.from::<User>()?
            .filter(|e| e.column(User::score())?.gte(90))?
            .project_scalars((User::id(), User::email()))?
            .finish()
    })?
    .project_tuple::<(i32, String)>();</code></pre>
        </div>
        <div class="mini-card secondary sql-card">
<pre><code>SELECT team, AVG(score) AS avg_score
FROM contributors
WHERE score &gt;= 80
GROUP BY team
ORDER BY avg_score DESC;</code></pre>
        </div>
      </div>
    </section>

    <section class="section-block" id="features">
      <div class="section-heading">
        <div>
          <div class="eyebrow">Why KiteSQL</div>
          <h2>Built for application-native relational workflows</h2>
        </div>
        <p>
          KiteSQL is not only a database engine. It is a relational runtime you can call directly from Rust,
          with SQL and typed APIs living on the same surface.
        </p>
      </div>
      <div class="feature-grid">
        <article class="feature-card card-lite">
          <h3>Native Rust API</h3>
          <p>Use direct APIs for CRUD, schema management, transactions, and typed iteration without forcing every workflow through raw SQL strings.</p>
        </article>
        <article class="feature-card card-lite">
          <h3>Built-in ORM</h3>
          <p>Derive <code>Model</code>, get tuple mapping, primary-key aware helpers, schema creation, migration support, and a lightweight query builder.</p>
        </article>
        <article class="feature-card card-lite">
          <h3>Schema evolution</h3>
          <p>Keep model changes close to code with migration helpers for add column, drop column, rename column, and change column workflows.</p>
        </article>
        <article class="feature-card card-lite">
          <h3>Runs in the browser</h3>
          <p>The published <code>kite_sql@0.3.2</code> WebAssembly build lets users explore KiteSQL in a browser tab with no backend service and no local database server.</p>
        </article>
      </div>
    </section>

    <section class="section-block split" id="docs">
      <div class="card-lite info-panel">
        <div class="eyebrow">Design philosophy</div>
        <h2><span class="headline-primary">Compact and expressive.</span><br /><span class="headline-secondary">Unapologetically Rust-native.</span></h2>
        <p>
          KiteSQL is built around the idea that relational power should feel natural inside a Rust application.
          It aims to stay small in operational weight while still covering the workflows that matter in practice.
        </p>
        <ul class="bullet-list">
          <li>Lightweight embedding instead of external database infrastructure</li>
          <li>Typed APIs without giving up direct SQL execution</li>
          <li>ORM helpers that extend into migrations and schema evolution</li>
          <li>Practical relational features without unnecessary abstraction layers</li>
          <li>A single engine that also runs in the browser through wasm</li>
        </ul>
        <div class="link-row">
          <a class="button" href="https://github.com/KipData/KiteSQL#readme" target="_blank" rel="noreferrer">Project README</a>
          <a class="button" href="https://github.com/KipData/KiteSQL/tree/main/src/orm" target="_blank" rel="noreferrer">ORM Guide</a>
        </div>
      </div>
      <div class="card-lite info-panel code-panel">
        <div class="eyebrow">Typical flow in 0.3.2</div>
<pre><code>let mut database = DataBaseBuilder::path("./data").build_rocksdb()?;

database.migrate::<User>()?;
database.insert_many(users)?;

let ranked = database
    .bind(|ctx| {
        ctx.from::<User>()?
            .filter(|e| e.column(User::score())?.gte(80))?
            .project_scalars((User::id(), User::email()))?
            .limit(20)?
            .finish()
    })?
    .project_tuple::<(i32, String)>();

let rows = database.run("select count(*) from users")?;</code></pre>
      </div>
    </section>

    <section class="section-block" id="playground">
      <div class="section-heading compact">
        <div>
          <div class="eyebrow">WebAssembly playground</div>
          <h2>Open a browser tab and play with KiteSQL</h2>
        </div>
        <p>This playground runs fully in your browser using the published <code>kite_sql@0.3.2</code> wasm bundle. No server, no backend, no setup beyond loading the page.</p>
      </div>

      <div class="playground card">
        <div class="playground-head">
          <div>
            <div class="section-title">Interactive SQL window</div>
            <div class="section-sub">Seed a demo dataset, run queries, then inspect the result table below.</div>
          </div>
          <div class="actions">
            <button id="runSql" class="primary">Run SQL</button>
            <button id="runDemo">Seed demo data</button>
            <button id="reset">Reset DB</button>
          </div>
        </div>

        <div class="examples playground-examples" id="examples">
          <button class="pill" data-example="topContributors">Top contributors</button>
          <button class="pill" data-example="averageByTeam">Average by team</button>
          <button class="pill" data-example="havingClause">Having clause</button>
          <button class="pill" data-example="updateAndView">Update + view</button>
        </div>

        <div class="playground-grid">
          <div class="editor-panel">
            <textarea id="sqlInput" class="sql-input" rows="10" spellcheck="false">${DEFAULT_SQL}</textarea>
          </div>
          <aside class="side-panel">
            <div class="side-card side-card-stack">
              <div>
                <div class="side-title">What the demo seeds</div>
                <p>A small <code>contributors</code> table with typed-ish relational data that is useful for filters, grouping, ordering, updates, and <code>having</code> queries.</p>
              </div>
              <div class="side-divider"></div>
              <div>
                <div class="side-title">Why keep this here</div>
                <p>The website is not only descriptive. It also gives users a zero-install place to try the engine before embedding it in a Rust project.</p>
              </div>
            </div>
          </aside>
        </div>

        <div class="status" id="status"></div>
        <div class="output" id="output">Loading WebAssembly...</div>
      </div>
    </section>
  </main>

  <footer class="footer-strip">
    <div>Runs entirely in the browser through the published <code>kite_sql@0.3.2</code> WebAssembly build.</div>
    <div class="footer-links">
      <a href="https://github.com/KipData/KiteSQL" target="_blank" rel="noreferrer">GitHub</a>
      <a href="https://crates.io/crates/kite_sql" target="_blank" rel="noreferrer">crates.io</a>
      <a href="https://github.com/KipData/KiteSQL/tree/main/docs" target="_blank" rel="noreferrer">Docs</a>
    </div>
  </footer>
`;
app.appendChild(ui);

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function installCodeCopyButtons(root: ParentNode) {
  root.querySelectorAll("pre").forEach((pre) => {
    if (pre.parentElement?.classList.contains("code-block")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "code-block";

    const toolbar = document.createElement("div");
    toolbar.className = "code-toolbar";

    const dots = document.createElement("div");
    dots.className = "code-dots";
    dots.innerHTML = '<span></span><span></span><span></span>';

    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code-btn";
    button.textContent = "Copy";

    button.addEventListener("click", async () => {
      const code = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
      if (!code.trim()) return;

      const previous = button.textContent;
      try {
        await copyText(code);
        button.textContent = "Copied";
        button.classList.add("copied");
      } catch (error) {
        console.error(error);
        button.textContent = "Failed";
        button.classList.add("failed");
      }

      window.setTimeout(() => {
        button.textContent = previous;
        button.classList.remove("copied", "failed");
      }, 1400);
    });

    toolbar.append(dots, button);
    pre.replaceWith(wrapper);
    wrapper.append(toolbar, pre);
  });
}

installCodeCopyButtons(ui);

const sqlInput = ui.querySelector<HTMLTextAreaElement>("#sqlInput")!;
const outputEl = ui.querySelector<HTMLDivElement>("#output")!;
const statusEl = ui.querySelector<HTMLDivElement>("#status")!;
const runSqlBtn = ui.querySelector<HTMLButtonElement>("#runSql")!;
const runDemoBtn = ui.querySelector<HTMLButtonElement>("#runDemo")!;
const resetBtn = ui.querySelector<HTMLButtonElement>("#reset")!;

let db: WasmDatabase | null = null;
const wasmReady = initKiteSql();

const setStatus = (text: string, ok = true) => {
  statusEl.textContent = text;
  statusEl.className = `status ${ok ? "ok" : "err"}`;
};

const unwrapValue = (val: any) => {
  if (val === undefined) return undefined;
  if (val === null) return null;
  if (typeof val === "object" && val && "value" in val) return (val as any).value;
  return val;
};

const extractValue = (v: any) => {
  const primitive =
    unwrapValue(v?.Int32) ??
    unwrapValue(v?.Int64) ??
    unwrapValue(v?.Float64) ??
    unwrapValue(v?.Utf8) ??
    unwrapValue(v?.Boolean);

  const finalValue = primitive !== undefined ? primitive : unwrapValue(v);
  if (finalValue === null || finalValue === undefined) return "null";
  if (typeof finalValue === "bigint") return finalValue.toString();
  if (typeof finalValue === "object") {
    try {
      return JSON.stringify(finalValue);
    } catch {
      return String(finalValue);
    }
  }
  return String(finalValue);
};

const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const columnNamesFromSchema = (schema: any) => {
  if (!Array.isArray(schema)) return [];
  return schema
    .map((col) => (typeof col?.name === "string" ? col.name : undefined))
    .filter((name): name is string => Boolean(name));
};

function renderRows(rows: any[], columnNames?: string[]) {
  if (!rows.length) {
    outputEl.innerHTML = '<div class="empty-state">No rows returned.</div>';
    return;
  }

  const columns =
    (columnNames && columnNames.length ? columnNames : undefined) ??
    rows[0]?.columns ??
    rows[0]?.keys ??
    rows[0]?.names ??
    rows[0]?.columns_names ??
    rows[0]?.columnNames ??
    rows[0]?.cols ??
    rows[0]?.values?.map((_: unknown, idx: number) => `c${idx + 1}`) ??
    [];

  const body = rows
    .map((row) => {
      const values = row.values ?? row;
      const cells = (values as any[])
        .map((v) => `<td>${escapeHtml(extractValue(v))}</td>`)
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  const header = (columns as any[])
    .map((c: any, idx: number) => `<th>${escapeHtml(String(c ?? `c${idx + 1}`))}</th>`)
    .join("");

  outputEl.innerHTML = [
    `<div class="result-meta">${rows.length} row(s)</div>`,
    '<table class="table">',
    `<thead><tr>${header}</tr></thead>`,
    `<tbody>${body}</tbody>`,
    "</table>",
  ].join("");
}

function splitStatements(sql: string) {
  return sql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function seedDemoData(showResult = true) {
  if (!db) await initDb(false);
  if (!db) return;

  const steps = [
    "insert into contributors values (1, 'Ada', 'engine', 98), (2, 'Lin', 'engine', 91), (3, 'Mia', 'product', 87), (4, 'Kai', 'research', 94), (5, 'Ivy', 'product', 89), (6, 'Noah', 'research', 96)",
    "update contributors set score = score + 1 where team = 'product'",
  ];

  db.ddl("drop table if exists contributors");
  db.ddl("create table contributors(id int primary key, name varchar, team varchar, score int)");

  for (const sql of steps) {
    await db.execute(sql);
  }

  if (showResult) {
    const result = db.run("select * from contributors order by score desc");
    const schema = typeof (result as any).schema === "function" ? (result as any).schema() : null;
    const columns = columnNamesFromSchema(schema);
    const rows = result.rows();
    renderRows(rows, columns);
  }

  setStatus("Demo data ready ✓", true);
}

async function initDb(seed = true) {
  await wasmReady;
  db?.free?.();
  db = new WasmDatabase();
  if (seed) await seedDemoData(false);
}

async function runSql(sqlText: string) {
  runSqlBtn.disabled = true;
  runDemoBtn.disabled = true;
  resetBtn.disabled = true;
  setStatus("Running SQL...");
  outputEl.textContent = "";

  try {
    if (!db) await initDb();
    const statements = splitStatements(sqlText);
    if (!statements.length) {
      setStatus("Please enter a SQL statement", false);
      outputEl.innerHTML = '<div class="empty-state">Write some SQL first.</div>';
      return;
    }

    let lastRows: any[] | null = null;
    let lastColumns: string[] | null = null;
    for (const sql of statements) {
      const isQuery = /^(select|with|pragma|explain|show)/i.test(sql.trim());
      if (isQuery) {
        const result = db!.run(sql);
        const schema = typeof (result as any).schema === "function" ? (result as any).schema() : null;
        lastColumns = columnNamesFromSchema(schema);
        lastRows = result.rows();
      } else {
        await db!.execute(sql);
      }
    }

    if (lastRows) {
      renderRows(lastRows, lastColumns ?? undefined);
      setStatus("Query completed ✓", true);
    } else {
      outputEl.innerHTML = `<div class="empty-state">Executed ${statements.length} statement(s).</div>`;
      setStatus("Done ✓", true);
    }
  } catch (err) {
    console.error(err);
    setStatus(`Error: ${(err as Error).message}`, false);
    outputEl.textContent = String(err);
  } finally {
    runSqlBtn.disabled = false;
    runDemoBtn.disabled = false;
    resetBtn.disabled = false;
  }
}

async function reset() {
  runSqlBtn.disabled = true;
  runDemoBtn.disabled = true;
  resetBtn.disabled = true;
  setStatus("Resetting DB...");
  try {
    await initDb();
    outputEl.innerHTML = '<div class="empty-state">Reset complete. Ready for another query.</div>';
    setStatus("Ready ✓");
  } catch (err) {
    console.error(err);
    setStatus(`Reset error: ${(err as Error).message}`, false);
    outputEl.textContent = String(err);
  } finally {
    runSqlBtn.disabled = false;
    runDemoBtn.disabled = false;
    resetBtn.disabled = false;
  }
}

runSqlBtn.addEventListener("click", () => void runSql(sqlInput.value));
runDemoBtn.addEventListener("click", () => {
  sqlInput.value = DEFAULT_SQL;
  void seedDemoData(true);
});
resetBtn.addEventListener("click", () => void reset());

ui.querySelectorAll<HTMLButtonElement>(".pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    const key = pill.dataset.example as keyof typeof SQL_EXAMPLES | undefined;
    const sql = key ? SQL_EXAMPLES[key] : "";
    sqlInput.value = sql;
    void runSql(sql);
  });
});

setStatus("Loading WebAssembly...");
initDb()
  .then(() => seedDemoData(true))
  .catch((err) => {
    console.error(err);
    outputEl.textContent = "Failed to load KiteSQL wasm bundle.";
    setStatus(`Init error: ${(err as Error).message}`, false);
  });
