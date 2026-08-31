function ExcelEditing() {
const [locked, setLocked] = React.useState(true);
const [password, setPassword] = React.useState("");
const [error, setError] = React.useState("");

const [reportName, setReportName] = React.useState(
"DBL Delivery Report"
);

const [fileName, setFileName] = React.useState(
"No file selected"
);

const [secondFileName, setSecondFileName] =
React.useState("Optional");

const [columns, setColumns] = React.useState([]);
const [rows, setRows] = React.useState([]);
const [search, setSearch] = React.useState("");

const [columnFilters, setColumnFilters] =
React.useState({});

/* =================================================
UNLOCK
================================================= */

const unlockUI = () => {
if (password === "1234") {
setLocked(false);
setPassword("");
setError("");
} else {
setError("Incorrect password.");
setPassword("");
}
};

/* =================================================
BUILD UNIQUE HEADERS
================================================= */

const buildHeaders = (headerRow) => {
const result = [];
const used = {};

```
headerRow.forEach((header, index) => {
  let name = String(header ?? "").trim();

  if (!name) {
    name = `Column ${index + 1}`;
  }

  const key = name.toLowerCase();

  if (used[key]) {
    used[key]++;
    name = `${name} ${used[key]}`;
  } else {
    used[key] = 1;
  }

  result.push(name);
});

return result;
```

};

/* =================================================
FORMAT EXCEL VALUE
================================================= */

const formatExcelValue = (value) => {
if (value === null || value === undefined) {
return "";
}

```
if (
  value instanceof Date &&
  !isNaN(value.getTime())
) {
  return (
    String(value.getDate()).padStart(2, "0") +
    "-" +
    String(value.getMonth() + 1).padStart(2, "0") +
    "-" +
    value.getFullYear()
  );
}

return String(value).trim();
```

};

/* =================================================
FIRST EXCEL UPLOAD
================================================= */

const handleExcelUpload = (event) => {
const file = event.target.files?.[0];

```
if (!file) return;

setFileName(file.name);

const reader = new FileReader();

reader.onload = (e) => {
  try {
    const XLSX = window.XLSX;

    if (!XLSX) {
      alert(
        "XLSX library is not loaded yet."
      );
      return;
    }

    const workbook = XLSX.read(
      new Uint8Array(e.target.result),
      {
        type: "array",
        cellDates: true,
      }
    );

    if (
      !workbook.SheetNames ||
      !workbook.SheetNames.length
    ) {
      alert("No worksheet found.");
      return;
    }

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const data =
      XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
        raw: false,
      });

    if (!data.length) {
      alert("Excel file is empty.");
      return;
    }

    const headers = buildHeaders(
      data[0] || []
    );

    const excelRows = data
      .slice(1)
      .filter((row) =>
        row.some(
          (cell) =>
            String(cell ?? "").trim() !== ""
        )
      )
      .map((row) => {
        const obj = {};

        headers.forEach(
          (header, index) => {
            obj[header] =
              formatExcelValue(
                row[index] ?? ""
              );
          }
        );

        return obj;
      });

    setColumns(headers);
    setRows(excelRows);
    setColumnFilters({});
    setSearch("");
  } catch (err) {
    console.error(err);

    alert(
      "Excel file read করা যায়নি.\n\n" +
        (err?.message || "Unknown error")
    );
  }
};

reader.onerror = () => {
  alert("File read failed.");
};

reader.readAsArrayBuffer(file);
```

};

/* =================================================
SECOND EXCEL
================================================= */

const handleSecondExcelUpload = (event) => {
const file = event.target.files?.[0];

```
if (!file) return;

setSecondFileName(file.name);
```

};

/* =================================================
COLUMN FILTER
================================================= */

const updateColumnFilter = (
column,
value
) => {
setColumnFilters((previous) => ({
...previous,
[column]: value,
}));
};

/* =================================================
FILTER DATA
================================================= */

const filteredRows = rows.filter(
(row) => {
const globalSearch =
search.trim().toLowerCase();

```
  if (globalSearch) {
    const text = columns
      .map((column) =>
        String(
          row[column] ?? ""
        ).toLowerCase()
      )
      .join(" ");

    if (!text.includes(globalSearch)) {
      return false;
    }
  }

  for (const column of columns) {
    const filterValue =
      String(
        columnFilters[column] ?? ""
      )
        .trim()
        .toLowerCase();

    if (!filterValue) continue;

    const cellValue =
      String(
        row[column] ?? ""
      ).toLowerCase();

    if (
      !cellValue.includes(
        filterValue
      )
    ) {
      return false;
    }
  }

  return true;
}
```

);

/* =================================================
EDIT CELL
================================================= */

const editCell = (
originalRowIndex,
column,
value
) => {
setRows((previous) =>
previous.map(
(row, index) =>
index ===
originalRowIndex
? {
...row,
[column]: value,
}
: row
)
);
};

/* =================================================
CLEAR FILTERS
================================================= */

const clearFilters = () => {
setSearch("");
setColumnFilters({});
};

/* =================================================
CLEAR ALL
================================================= */

const clearAll = () => {
setSearch("");
setColumnFilters({});
setReportName(
"DBL Delivery Report"
);
};

/* =================================================
SAVE EXCEL
================================================= */

const saveExcel = () => {
if (!rows.length) {
alert(
"আগে 1st Excel upload করুন।"
);
return;
}

```
const XLSX = window.XLSX;

if (!XLSX) {
  alert(
    "XLSX library is not loaded."
  );
  return;
}

const exportData = rows.map(
  (row) => {
    const obj = {};

    columns.forEach(
      (column) => {
        obj[column] =
          row[column] ?? "";
      }
    );

    return obj;
  }
);

const worksheet =
  XLSX.utils.json_to_sheet(
    exportData,
    {
      header: columns,
    }
  );

const workbook =
  XLSX.utils.book_new();

XLSX.utils.book_append_sheet(
  workbook,
  worksheet,
  "Delivery Data"
);

const safeName =
  reportName
    .replace(
      /[\\/:*?"<>|]/g,
      "_"
    )
    .trim() ||
  "DBL_Delivery_Report";

XLSX.writeFile(
  workbook,
  `${safeName}.xlsx`
);
```

};

/* =================================================
PRINT
================================================= */

const printTable = () => {
if (!rows.length) {
alert(
"আগে Excel upload করুন।"
);
return;
}

```
window.print();
```

};

/* =================================================
ADD COLUMN
================================================= */

const addColumn = () => {
let counter = 1;
let newColumn =
`New Column ${counter}`;

```
while (
  columns.includes(newColumn)
) {
  counter++;
  newColumn =
    `New Column ${counter}`;
}

setColumns((previous) => [
  ...previous,
  newColumn,
]);

setRows((previous) =>
  previous.map((row) => ({
    ...row,
    [newColumn]: "",
  }))
);
```

};

/* =================================================
LOCK
================================================= */

const lockUI = () => {
setLocked(true);
setPassword("");
setError("");
};

/* =================================================
LOCK SCREEN
================================================= */

if (locked) {
return ( <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-gradient-to-br from-[#f5f7fa] to-[#e8edf3] p-5"> <div className="w-full max-w-[390px] overflow-hidden rounded-2xl bg-white shadow-[0_15px_50px_rgba(0,0,0,0.18)]">

```
      <div className="bg-gradient-to-r from-[#319a82] to-[#82c83b] px-6 py-7 text-center text-white">

        <div className="mb-3 text-5xl">
          🔒
        </div>

        <div className="text-2xl font-bold">
          Excel Editing Locked
        </div>

        <div className="mt-2 text-sm text-white/90">
          Enter password to access
          the application
        </div>

      </div>

      <div className="p-6">

        <label className="mb-2 block text-sm font-bold text-slate-700">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          autoFocus
          autoComplete="off"
          onChange={(e) => {
            setPassword(
              e.target.value
            );
            setError("");
          }}
          onKeyDown={(e) => {
            if (
              e.key === "Enter"
            ) {
              unlockUI();
            }
          }}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="button"
          onClick={unlockUI}
          className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-700 active:scale-[0.98]"
        >
          Unlock
        </button>

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-center text-xs text-slate-500">
        SH Group • Excel Editing
      </div>

    </div>
  </div>
);
```

}

/* =================================================
MAIN UI
================================================= */

return ( <div className="min-h-screen bg-[#f5f5f5]">

```
  {/* TOP AREA */}

  <div className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">

    <div className="mx-auto max-w-[1600px]">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        {/* REPORT NAME */}

        <div className="w-full lg:max-w-[430px]">

          <label className="mb-1.5 block text-sm font-bold text-slate-700">
            Report Name
          </label>

          <input
            type="text"
            value={reportName}
            onChange={(e) =>
              setReportName(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* TOP BUTTONS */}

        <div className="flex flex-wrap gap-2">

          <button
            type="button"
            onClick={() => {}}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Apply 🔍
          </button>

          <button
            type="button"
            onClick={clearAll}
            className="rounded-lg bg-slate-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-600"
          >
            Clear ↻
          </button>

          <button
            type="button"
            onClick={lockUI}
            className="rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
          >
            🔒 Lock
          </button>

        </div>

      </div>

      {/* UPLOAD AREA */}

      <div className="mt-4 grid gap-3 lg:grid-cols-2">

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">

          <div className="mb-2 text-sm font-bold text-blue-800">
            1st Excel
          </div>

          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={
              handleExcelUpload
            }
            className="block w-full text-sm"
          />

          <div className="mt-2 truncate text-xs text-slate-600">
            {fileName}
          </div>

        </div>

        <div className="rounded-lg border border-purple-100 bg-purple-50 p-3">

          <div className="mb-2 text-sm font-bold text-purple-800">
            2nd Excel
          </div>

          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={
              handleSecondExcelUpload
            }
            className="block w-full text-sm"
          />

          <div className="mt-2 truncate text-xs text-slate-600">
            {secondFileName}
          </div>

        </div>

      </div>

    </div>

  </div>

  {/* TOOLBAR */}

  <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6">

    <div className="mx-auto flex max-w-[1600px] flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

      <div className="flex flex-wrap items-center gap-2">

        {/* SEARCH */}

        <div className="relative min-w-[260px] flex-1 sm:flex-none">

          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search all columns..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="rounded-lg bg-slate-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-600"
        >
          Clear Filters
        </button>

        <button
          type="button"
          onClick={() =>
            alert(
              "Column manager can be added here."
            )
          }
          className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700"
        >
          Columns ▾
        </button>

        <button
          type="button"
          onClick={() =>
            alert(
              "Mapping feature can be added here."
            )
          }
          className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
        >
          Mapping ⚙
        </button>

        <button
          type="button"
          onClick={addColumn}
          className="rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-purple-700"
        >
          + Column
        </button>

        <button
          type="button"
          onClick={saveExcel}
          className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
        >
          💾 Save Excel
        </button>

        <button
          type="button"
          onClick={printTable}
          className="rounded-lg bg-slate-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
        >
          🖨 Print
        </button>

      </div>

      <div className="text-sm text-slate-600">
        Showing{" "}
        <strong className="text-slate-900">
          {filteredRows.length}
        </strong>{" "}
        of{" "}
        <strong className="text-slate-900">
          {rows.length}
        </strong>{" "}
        records
      </div>

    </div>

  </div>

  {/* TABLE */}

  <div className="mx-auto max-w-[1600px] p-4 sm:p-6">

    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        {!rows.length ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center px-5 text-center">

            <div className="text-6xl">
              📊
            </div>

            <div className="mt-4 text-xl font-bold text-slate-700">
              No Excel data loaded
            </div>

            <div className="mt-1 text-sm text-slate-500">
              Upload your first Excel
              file above.
            </div>

          </div>
        ) : (
          <table
            id="dataTable"
            className="w-full min-w-max border-collapse text-sm"
          >

            <thead>

              <tr className="bg-slate-800 text-white">

                {columns.map(
                  (column) => (
                    <th
                      key={column}
                      className="whitespace-nowrap border border-slate-700 px-4 py-3 text-left font-bold"
                    >
                      {column}
                    </th>
                  )
                )}

              </tr>

              <tr className="bg-slate-100">

                {columns.map(
                  (column) => (
                    <th
                      key={column}
                      className="border border-slate-200 p-2"
                    >
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={
                          columnFilters[
                            column
                          ] || ""
                        }
                        onChange={(e) =>
                          updateColumnFilter(
                            column,
                            e.target.value
                          )
                        }
                        className="w-full min-w-[100px] rounded border border-slate-300 px-2 py-1.5 text-xs font-normal text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                      />
                    </th>
                  )
                )}

              </tr>

            </thead>

            <tbody>

              {filteredRows.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={
                      Math.max(
                        columns.length,
                        1
                      )
                    }
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No matching
                    records found.
                  </td>
                </tr>
              ) : (
                filteredRows.map(
                  (row) => {
                    const originalRowIndex =
                      rows.indexOf(
                        row
                      );

                    return (
                      <tr
                        key={
                          originalRowIndex
                        }
                        className="transition hover:bg-blue-50"
                      >
                        {columns.map(
                          (
                            column
                          ) => (
                            <td
                              key={
                                column
                              }
                              onDoubleClick={() => {
                                const value =
                                  window.prompt(
                                    `Edit ${column}`,
                                    row[
                                      column
                                    ] ??
                                      ""
                                  );

                                if (
                                  value !==
                                  null
                                ) {
                                  editCell(
                                    originalRowIndex,
                                    column,
                                    value
                                  );
                                }
                              }}
                              title="Double-click to edit"
                              className="cursor-text whitespace-nowrap border border-slate-200 px-4 py-2.5 text-slate-700"
                            >
                              {
                                row[
                                  column
                                ]
                              }
                            </td>
                          )
                        )}
                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>
        )}

      </div>

    </div>

    {rows.length > 0 && (
      <div className="mt-3 text-xs text-slate-500">
        Tip: Double-click any cell
        to edit its value.
      </div>
    )}

  </div>

</div>
```

);
}
