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

  const [secondFileName, setSecondFileName] = React.useState(
    "Optional"
  );

  const [columns, setColumns] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [search, setSearch] = React.useState("");

  /* ================================
     UNLOCK
  ================================= */

  function unlockUI() {

    if (password === "1234") {

      setLocked(false);
      setPassword("");
      setError("");

    } else {

      setError("Incorrect password.");
      setPassword("");

    }
  }

  /* ================================
     BUILD HEADERS
  ================================= */

  function buildHeaders(headerRow) {

    const result = [];
    const used = {};

    headerRow.forEach(function (header, index) {

      let name = String(
        header == null ? "" : header
      ).trim();

      if (!name) {
        name = "Column " + (index + 1);
      }

      const key = name.toLowerCase();

      if (used[key]) {

        used[key] = used[key] + 1;

        name =
          name +
          " " +
          used[key];

      } else {

        used[key] = 1;

      }

      result.push(name);

    });

    return result;
  }

  /* ================================
     FORMAT EXCEL VALUE
  ================================= */

  function formatExcelValue(value) {

    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    if (
      value instanceof Date &&
      !isNaN(value.getTime())
    ) {

      return (
        String(
          value.getDate()
        ).padStart(2, "0") +
        "-" +
        String(
          value.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        value.getFullYear()
      );

    }

    return String(value).trim();
  }

  /* ================================
     EXCEL UPLOAD
  ================================= */

  function handleExcelUpload(event) {

    const file =
      event.target.files &&
      event.target.files[0];

    if (!file) {
      return;
    }

    setFileName(file.name);

    const reader =
      new FileReader();

    reader.onload = function (event) {

      try {

        const XLSX =
          window.XLSX;

        if (!XLSX) {

          alert(
            "XLSX library is not loaded."
          );

          return;
        }

        const arrayBuffer =
          event.target.result;

        const workbook =
          XLSX.read(
            new Uint8Array(arrayBuffer),
            {
              type: "array",
              cellDates: true
            }
          );

        if (
          !workbook.SheetNames ||
          workbook.SheetNames.length === 0
        ) {

          alert(
            "No worksheet found."
          );

          return;
        }

        const sheet =
          workbook.Sheets[
            workbook.SheetNames[0]
          ];

        const data =
          XLSX.utils.sheet_to_json(
            sheet,
            {
              header: 1,
              defval: "",
              raw: false
            }
          );

        if (
          !data ||
          data.length === 0
        ) {

          alert(
            "Excel file is empty."
          );

          return;
        }

        const headers =
          buildHeaders(data[0]);

        const excelRows =
          data
            .slice(1)
            .filter(function (row) {

              return row.some(
                function (cell) {

                  return String(
                    cell == null
                      ? ""
                      : cell
                  ).trim() !== "";

                }
              );

            })
            .map(function (row) {

              const obj = {};

              headers.forEach(
                function (header, index) {

                  obj[header] =
                    formatExcelValue(
                      row[index] == null
                        ? ""
                        : row[index]
                    );

                }
              );

              return obj;

            });

        setColumns(headers);
        setRows(excelRows);

      } catch (err) {

        console.error(
          "Excel Error:",
          err
        );

        alert(
          "Excel file read করা যায়নি.\n\n" +
          (
            err &&
            err.message
              ? err.message
              : String(err)
          )
        );
      }
    };

    reader.onerror = function () {

      alert(
        "File read করা যায়নি."
      );

    };

    reader.readAsArrayBuffer(file);
  }

  /* ================================
     SEARCH
  ================================= */

  const filteredRows =
    rows.filter(function (row) {

      if (!search.trim()) {
        return true;
      }

      const text =
        columns
          .map(function (column) {

            return String(
              row[column] == null
                ? ""
                : row[column]
            ).toLowerCase();

          })
          .join(" ");

      return text.includes(
        search.toLowerCase()
      );

    });

  /* ================================
     EDIT CELL
  ================================= */

  function editCell(
    rowIndex,
    column,
    value
  ) {

    setRows(function (previous) {

      return previous.map(
        function (row, index) {

          if (index !== rowIndex) {
            return row;
          }

          return {
            ...row,
            [column]: value
          };

        }
      );

    });
  }

  /* ================================
     SAVE EXCEL
  ================================= */

  function saveExcel() {

    if (!rows.length) {

      alert(
        "আগে 1st Excel upload করুন।"
      );

      return;
    }

    const XLSX =
      window.XLSX;

    if (!XLSX) {

      alert(
        "XLSX library is not loaded."
      );

      return;
    }

    const exportData =
      rows.map(function (row) {

        const obj = {};

        columns.forEach(
          function (column) {

            obj[column] =
              row[column] == null
                ? ""
                : row[column];

          }
        );

        return obj;
      });

    const worksheet =
      XLSX.utils.json_to_sheet(
        exportData,
        {
          header: columns
        }
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Delivery Data"
    );

    let safeName =
      reportName
        .replace(
          /[\\/:*?"<>|]/g,
          "_"
        )
        .trim();

    if (!safeName) {
      safeName =
        "DBL_Delivery_Report";
    }

    XLSX.writeFile(
      workbook,
      safeName + ".xlsx"
    );
  }

  /* ================================
     CLEAR
  ================================= */

  function clearAll() {

    setSearch("");

    setReportName(
      "DBL Delivery Report"
    );
  }

  /* ================================
     RENDER
  ================================= */

  return (
    <>

      {/* ============================
          LOCK SCREEN
      ============================= */}

      {locked && (

        <div className="ui-lock-overlay">

          <div className="lock-box">

            <div className="lock-header">

              <div className="lock-icon">
                🔒
              </div>

              <div className="lock-title">
                Excel Editing Locked
              </div>

              <div className="lock-subtitle">
                Enter password to access the application
              </div>

            </div>

            <div className="lock-body">

              <label className="lock-label">
                Password
              </label>

              <div className="lock-password-wrap">

                <input
                  type="password"
                  className="lock-password"
                  placeholder="Enter password"
                  value={password}
                  autoFocus
                  onChange={
                    function (event) {
                      setPassword(
                        event.target.value
                      );
                      setError("");
                    }
                  }
                  onKeyDown={
                    function (event) {

                      if (
                        event.key ===
                        "Enter"
                      ) {
                        unlockUI();
                      }

                    }
                  }
                />

                <button
                  type="button"
                  className="lock-button"
                  onClick={unlockUI}
                >
                  Unlock
                </button>

              </div>

              <div className="lock-error">
                {error}
              </div>

            </div>

            <div className="lock-footer">
              SH Group • Excel Editing
            </div>

          </div>

        </div>
      )}

      {/* ============================
          MAIN
      ============================= */}

      <div className="main-area">

        {/* ==========================
            FILTER
        =========================== */}

        <div className="filter-area">

          <div className="filter-row">

            <div className="report-name-field">

              <label>
                Report Name
              </label>

              <input
                type="text"
                className="report-name-input"
                value={reportName}
                onChange={
                  function (event) {
                    setReportName(
                      event.target.value
                    );
                  }
                }
              />

            </div>

            <div className="top-buttons">

              <button
                type="button"
                className="btn"
                onClick={
                  function () {}
                }
              >
                Apply 🔍
              </button>

              <button
                type="button"
                className="btn clear"
                onClick={clearAll}
              >
                Clear ↻
              </button>

            </div>

          </div>

          {/* ========================
              UPLOAD
          ========================= */}

          <div className="upload-area">

            <div className="upload-row">

              <div className="upload-title">
                1st Excel:
              </div>

              <input
                type="file"
                className="excel-input"
                accept=".xlsx,.xls,.csv"
                onChange={
                  handleExcelUpload
                }
              />

              <div className="file-name">
                {fileName}
              </div>

            </div>

            <div className="upload-row">

              <div className="upload-title second">
                2nd Excel:
              </div>

              <input
                type="file"
                className="excel-input"
                accept=".xlsx,.xls,.csv"
                onChange={
                  function (event) {

                    const file =
                      event.target.files &&
                      event.target.files[0];

                    if (file) {

                      setSecondFileName(
                        file.name
                      );

                    }

                  }
                }
              />

              <div className="file-name">
                {secondFileName}
              </div>

            </div>

          </div>

        </div>

        {/* ==========================
            TOOLBAR
        =========================== */}

        <div className="table-toolbar">

          <div className="toolbar-left">

            <div className="search-box">

              <div className="search-icon">
                🔍
              </div>

              <input
                type="text"
                className="global-search"
                placeholder="Search all columns..."
                value={search}
                onChange={
                  function (event) {
                    setSearch(
                      event.target.value
                    );
                  }
                }
              />

            </div>

            <button
              type="button"
              className="btn clear"
              onClick={
                function () {
                  setSearch("");
                }
              }
            >
              Clear Filters
            </button>

            <button
              type="button"
              className="btn green"
            >
              Columns ▾
            </button>

            <button
              type="button"
              className="btn orange"
            >
              Mapping ⚙
            </button>

            <button
              type="button"
              className="btn purple"
            >
              + Column
            </button>

            <button
              type="button"
              className="btn save"
              onClick={saveExcel}
            >
              💾 Save Excel
            </button>

            <button
              type="button"
              className="btn print-btn"
              onClick={
                function () {
                  window.print();
                }
              }
            >
              🖨 Print
            </button>

          </div>

          <div className="record-info">

            Showing{" "}

            <strong>
              {filteredRows.length}
            </strong>{" "}

            records

          </div>

        </div>

        {/* ==========================
            TABLE
        =========================== */}

        <div className="table-wrapper">

          {!rows.length ? (

            <div className="empty-state">

              <div className="empty-icon">
                📊
              </div>

              <div className="empty-title">
                No Excel data loaded
              </div>

              <div className="empty-text">
                Upload your first Excel file above.
              </div>

            </div>

          ) : (

            <table id="dataTable">

              <thead>

                <tr>

                  {columns.map(
                    function (column) {

                      return (
                        <th
                          key={column}
                        >
                          {column}
                        </th>
                      );

                    }
                  )}

                </tr>

                <tr className="filter-header">

                  {columns.map(
                    function (column) {

                      return (
                        <th
                          key={column}
                        >

                          <input
                            className="column-filter"
                            placeholder="Filter..."
                          />

                        </th>
                      );

                    }
                  )}

                </tr>

              </thead>

              <tbody>

                {filteredRows.map(
                  function (
                    row,
                    filteredIndex
                  ) {

                    const realIndex =
                      rows.indexOf(row);

                    return (
                      <tr
                        key={
                          filteredIndex
                        }
                      >

                        {columns.map(
                          function (column) {

                            return (
                              <td
                                key={column}
                                onDoubleClick={
                                  function () {

                                    const value =
                                      window.prompt(
                                        "Edit " +
                                        column,
                                        row[column] ||
                                          ""
                                      );

                                    if (
                                      value !==
                                      null
                                    ) {

                                      editCell(
                                        realIndex,
                                        column,
                                        value
                                      );

                                    }

                                  }
                                }
                                title="Double-click to edit"
                              >
                                {
                                  row[column] ||
                                  ""
                                }
                              </td>
                            );

                          }
                        )}

                      </tr>
                    );

                  }
                )}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </>
  );
}
