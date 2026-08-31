import React, { useEffect, useState } from "react";

export default function ExcelEditing() {
  const [locked, setLocked] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [reportName, setReportName] = useState("DBL Delivery Report");
  const [fileName, setFileName] = useState("No file selected");
  const [secondFileName, setSecondFileName] = useState("Optional");

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");

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

  const handleExcelUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        /*
          XLSX is loaded from CDN.
          No npm/package required.
        */

        const XLSX = window.XLSX;

        if (!XLSX) {
          alert("XLSX library is not loaded yet.");
          return;
        }

        const workbook = XLSX.read(
          new Uint8Array(e.target.result),
          {
            type: "array",
            cellDates: true,
          }
        );

        const sheet =
          workbook.Sheets[workbook.SheetNames[0]];

        const data = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
          raw: false,
        });

        if (!data.length) {
          alert("Excel file is empty.");
          return;
        }

        const headers = buildHeaders(data[0]);

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

            headers.forEach((header, index) => {
              obj[header] = formatExcelValue(
                row[index] ?? ""
              );
            });

            return obj;
          });

        setColumns(headers);
        setRows(excelRows);
      } catch (err) {
        console.error(err);
        alert(
          "Excel file read করা যায়নি.\n\n" +
            err.message
        );
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const buildHeaders = (headerRow) => {
    const result = [];
    const used = {};

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
  };

  const formatExcelValue = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

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
  };

  const filteredRows = rows.filter((row) => {
    if (!search.trim()) return true;

    const text = columns
      .map((column) =>
        String(row[column] ?? "").toLowerCase()
      )
      .join(" ");

    return text.includes(search.toLowerCase());
  });

  const editCell = (rowIndex, column, value) => {
    setRows((previous) =>
      previous.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              [column]: value,
            }
          : row
      )
    );
  };

  const saveExcel = () => {
    if (!rows.length) {
      alert("আগে 1st Excel upload করুন।");
      return;
    }

    const XLSX = window.XLSX;

    if (!XLSX) {
      alert("XLSX library is not loaded.");
      return;
    }

    const exportData = rows.map((row) => {
      const obj = {};

      columns.forEach((column) => {
        obj[column] = row[column] ?? "";
      });

      return obj;
    });

    const worksheet =
      XLSX.utils.json_to_sheet(exportData, {
        header: columns,
      });

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Delivery Data"
    );

    const safeName =
      reportName
        .replace(/[\\/:*?"<>|]/g, "_")
        .trim() || "DBL_Delivery_Report";

    XLSX.writeFile(
      workbook,
      `${safeName}.xlsx`
    );
  };

  return (
    <>
      {/* ================= UI LOCK ================= */}

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
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      unlockUI();
                    }
                  }}
                  autoFocus
                />

                <button
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

      {/* ================= MAIN ================= */}

      <div className="main-area">
        <div className="filter-area">
          <div className="filter-row">
            <div className="report-name-field">
              <label>Report Name</label>

              <input
                type="text"
                className="report-name-input"
                value={reportName}
                onChange={(e) =>
                  setReportName(e.target.value)
                }
              />
            </div>

            <div className="top-buttons">
              <button
                className="btn"
                onClick={() => {}}
              >
                Apply 🔍
              </button>

              <button
                className="btn clear"
                onClick={() => {
                  setSearch("");
                  setReportName(
                    "DBL Delivery Report"
                  );
                }}
              >
                Clear ↻
              </button>
            </div>
          </div>

          {/* ================= UPLOAD ================= */}

          <div className="upload-area">
            <div className="upload-row">
              <div className="upload-title">
                1st Excel:
              </div>

              <input
                type="file"
                className="excel-input"
                accept=".xlsx,.xls,.csv"
                onChange={handleExcelUpload}
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
                onChange={(e) => {
                  const file =
                    e.target.files?.[0];

                  if (file) {
                    setSecondFileName(
                      file.name
                    );
                  }
                }}
              />

              <div className="file-name">
                {secondFileName}
              </div>
            </div>
          </div>
        </div>

        {/* ================= TOOLBAR ================= */}

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
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <button
              className="btn clear"
              onClick={() => setSearch("")}
            >
              Clear Filters
            </button>

            <button className="btn green">
              Columns ▾
            </button>

            <button className="btn orange">
              Mapping ⚙
            </button>

            <button className="btn purple">
              + Column
            </button>

            <button
              className="btn save"
              onClick={saveExcel}
            >
              💾 Save Excel
            </button>

            <button className="btn print-btn">
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

        {/* ================= TABLE ================= */}

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
                  {columns.map((column) => (
                    <th key={column}>
                      {column}
                    </th>
                  ))}
                </tr>

                <tr className="filter-header">
                  {columns.map((column) => (
                    <th key={column}>
                      <input
                        className="column-filter"
                        placeholder="Filter..."
                      />
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredRows.map(
                  (row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((column) => (
                        <td
                          key={column}
                          onDoubleClick={() => {
                            const value =
                              prompt(
                                `Edit ${column}`,
                                row[column] ?? ""
                              );

                            if (
                              value !== null
                            ) {
                              editCell(
                                rowIndex,
                                column,
                                value
                              );
                            }
                          }}
                        >
                          {row[column] ?? ""}
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
