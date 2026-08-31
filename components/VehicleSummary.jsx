function VehicleSummary() {
  const [excelRows, setExcelRows] = React.useState([]);
  const [inputRows, setInputRows] = React.useState([]);
  const [pasteInput, setPasteInput] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [statusColor, setStatusColor] = React.useState("text-gray-700");
  const [selectedDates, setSelectedDates] = React.useState([]);
  const [report, setReport] = React.useState([]);

  const fileInputRef = React.useRef(null);

  const normalize = (value) => {
    if (value === null || value === undefined) return "";

    return String(value)
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/\u00a0/g, " ")
      .replace(/[\r\n\t]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();
  };

  const numberValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return 0;
    }

    const text = String(value)
      .replace(/,/g, "")
      .replace(/[^\d.-]/g, "");

    const num = parseFloat(text);

    return isNaN(num) ? 0 : num;
  };

  const formatNumber = (value) => {
    if (!isFinite(value)) return "0";

    return Number(value).toLocaleString("en-US", {
      maximumFractionDigits: 3
    });
  };

  const findColumn = (row, names) => {
    const keys = Object.keys(row);

    for (const name of names) {
      const target = normalize(name);

      const exact = keys.find(
        (key) => normalize(key) === target
      );

      if (exact) return exact;
    }

    for (const name of names) {
      const target = normalize(name);

      const partial = keys.find((key) => {
        const current = normalize(key);

        return (
          current.includes(target) ||
          target.includes(current)
        );
      });

      if (partial) return partial;
    }

    return null;
  };

  const customerMap = [
    ["MAWNA FASHIONS LTD. Jinnat Knitwear Ltd", "JINNAT"],
    ["FLAMINGO FASHIONS LTD. FLAMINGO FASHIONS LTD. SARDAGONJ, KASHIMPUR, GAZIPUR", "JINNAT"],
    ["FB FOOTWEAR LTD. Uloshara, Kaliakoir, Gazipur", "FB"],
    ["JINNAT KNITWEARS LTD. SARDAGONJ, KASHIMPUR, GAZIPUR", "JINNAT"],
    ["FLAMINGO FASHIONS LTD. (FFL2-1)_FLAMINGO FASHIONS LTD.", "FFL2"],
    ["MAWNA FASHIONS LTD. MAWNA, SHREEPUR, GAZIPUR", "MAWNA"],
    ["PARASOLE FOOTWEAR LTD. Moddho Gazirchat, Ashulia, Savar, Dhaka.", "PARASOL"],
    ["JINNAT KNITWEARS LTD. (JKL-U2-2)_JINNAT KNITWEARS LTD.", "JKL-2"],
    ["JINNAT KNITWEARS LTD. (FFL2-1)_FLAMINGO FASHIONS LTD.", "FFL2"],
    ["Bonshoe Bangladesh Ltd. Plot#1-5, Sector# 5, CEPZ Chattogram", "BONSHOE"],
    ["JINNAT FASHIONS LTD. SARDAGONJ, KASHIMPUR, GAZIPUR", "JINNAT"],
    ["APEX FOOTWEAR LIMITED. Shafipur, Kaliakoir, Gazipur", "APEX"],
    ["EDISON FOOTWEAR LTD. J L No: 5, Mirzapur, Gazipur Sadar,1700 Gazipur, Bangladesh", "EDISION"],
    ["THANBEE PRINT WORLD LTD. SARDAGONJ, KASHIMPUR, GAZIPUR", "THANBE"],
    ["JINNAT FASHIONS LTD. JINNAT FASHIONS LTD.", "JINNAT"],
    ["VULUA FOOTWEAR INDUSTRIES LTD. Dighamatia, Hemayetpur, Savar, Dhaka, Bangladesh", "VULUA"],
    ["MATIN SPINNING MILLS PLC SARDAGONJ, KASHIMPUR, GAZIPUR", "MATIN"],
    ["FOOTBED FOOTWEAR LTD. ULOSHARA, KAI.IAKOI R, GAZIPUR", "FOOTBED"],
    ["DBL CERAMICS LTD. MAWNA, SREEPUR, GAZIPUR", "CERAMICS"],
    ["UTAH FASHIONS LTD 1st-6th Floor, South Shalna, PO: Shalna Bazar, PS: Gazipur Sadar, Gazipur, Bangladesh.", "UTAH FASHION"],
    ["GLORY TEXTILES & APPARELS LTD.", "GLORY"],
    ["EU DESIGN, HK LTD.", "EU DESIGN"],
    ["PARKWAY PACKAGING & PRINTING PLC", "PARKWAY"],
    ["TEXTILE TESTING SERVICES LTD.", "TTSL"],
    ["MEHNAZ STYLES & CRAFT LTD.", "MEHNAZ"],
    ["COLOR CITY LTD.", "COLOR"],
    ["JINNAT APPARELS LTD.", "JINNAT"],
    ["EUDB ACCESSORIES LIMITED", "EUDB"],
    ["DB TEX LTD.", "DB TEX"],
    ["Nuovo Shoes (BD) Ltd.", "NUOVO SHOES"],
    ["OMC FOOTWEAR LIMITED", "OMC"],
    ["HAMZA TEXTILES LTD.", "HAMZA"],
    ["COMFIT COMPOSITE KNIT LTD.", "COMFIT"],
    ["Fabrica Knit Composite Ltd.", "FAVRICA"],
    ["DBL Pharmaceuticals Ltd.", "PRHARMA"],
    ["MATRIGHOR LIMITED.", "MATRIGH"],
    ["T.K. FOOTWEAR LIMITED.", "T.K. FOOTWEAR"],
    ["Jinnat Textile Mills Ltd.", "Jinnat Textile"]
  ];

  const getMappedCustomer = (customer, location) => {
    const combined = normalize(
      customer + " " + location
    );

    for (const item of customerMap) {
      const source = normalize(item[0]);

      if (
        combined === source ||
        combined.includes(source) ||
        source.includes(combined)
      ) {
        return item[1];
      }
    }

    const checks = [
      [/APEX FOOTWEAR/, "APEX"],
      [/JINNAT APPARELS/, "JINNAT"],
      [/JINNAT FASHIONS/, "JINNAT"],
      [/FFL2/, "FFL2"],
      [/JKL-U2/, "JKL-2"],
      [/JKL-1/, "JINNAT"],
      [/GLORY TEXTILES/, "GLORY"],
      [/GLORY TEXTILE/, "GLORY"],
      [/FOOTBED/, "FOOTBED"],
      [/UTAH KNITTING/, "UTAH KNITING"],
      [/UTAH FASHIONS/, "UTAH FASHION"],
      [/FAVRICA|FABRICA/, "FAVRICA"],
      [/T\.K\. FOOTWEAR/, "T.K. FOOTWEAR"],
      [/PARASOLE/, "PARASOL"],
      [/BONSHOE/, "BONSHOE"],
      [/MATIN SPINNING/, "MATIN"],
      [/MEHNAZ/, "MEHNAZ"],
      [/COLOR CITY/, "COLOR"],
      [/PARKWAY/, "PARKWAY"],
      [/TEXTILE TESTING/, "TTSL"],
      [/EU DESIGN/, "EU DESIGN"],
      [/EUDB/, "EUDB"],
      [/DB TEX/, "DB TEX"],
      [/NUOVO SHOES/, "NUOVO SHOES"],
      [/OMC FOOTWEAR/, "OMC"],
      [/HAMZA TEXTILES/, "HAMZA"],
      [/COMFIT/, "COMFIT"],
      [/DBL CERAMICS/, "CERAMICS"],
      [/DBL PHARMACEUTICALS/, "PRHARMA"],
      [/MATRIGHOR/, "MATRIGH"],
      [/VULUA/, "VULUA"],
      [/THANBEE/, "THANBE"],
      [/FB FOOTWEAR/, "FB"]
    ];

    for (const [regex, value] of checks) {
      if (regex.test(combined)) {
        return value;
      }
    }

    return customer || "Unknown";
  };

  const prepareExcelData = (rows) => {
    return rows.map((row) => {
      const gateCol = findColumn(row, [
        "Gate Pass No",
        "Gate Pass",
        "GatePass No"
      ]);

      const challanCol = findColumn(row, [
        "Challan No",
        "Challan"
      ]);

      const qtyCol = findColumn(row, [
        "Quantity",
        "Qty"
      ]);

      const weightCol = findColumn(row, [
        "Net Weight",
        "NetWeight",
        "Weight"
      ]);

      const bagCol = findColumn(row, [
        "Bag/Ctn",
        "Bag Ctn",
        "Bag/Ctns",
        "Bag"
      ]);

      const customerCol = findColumn(row, [
        "Customer Name",
        "Customer",
        "Buyer Name"
      ]);

      const locationCol = findColumn(row, [
        "Delilocation",
        "Delivery Location",
        "DeliveryLocation",
        "Location"
      ]);

      const vehicleCol = findColumn(row, [
        "Vehicle No",
        "Vehicle Number"
      ]);

      return {
        gatePass: gateCol
          ? String(row[gateCol]).trim()
          : "",

        challan: challanCol
          ? String(row[challanCol]).trim()
          : "",

        quantity: numberValue(
          qtyCol ? row[qtyCol] : 0
        ),

        netWeight: numberValue(
          weightCol ? row[weightCol] : 0
        ),

        bagCtn: numberValue(
          bagCol ? row[bagCol] : 0
        ),

        customer: customerCol
          ? String(row[customerCol]).trim()
          : "",

        location: locationCol
          ? String(row[locationCol]).trim()
          : "",

        vehicle: vehicleCol
          ? String(row[vehicleCol]).trim()
          : ""
      };
    });
  };

  const parsePastedData = (text) => {
    if (!text.trim()) return [];

    const lines = text
      .split(/\r?\n/)
      .map((x) => x.trim())
      .filter(Boolean);

    if (!lines.length) return [];

    let delimiter = "\t";

    if (!lines[0].includes("\t")) {
      if (lines[0].includes("|")) {
        delimiter = "|";
      } else {
        delimiter = /\s{2,}/;
      }
    }

    const headers = lines[0]
      .split(delimiter)
      .map(normalize);

    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(delimiter);

      if (cols.length <= 1) continue;

      const obj = {};

      headers.forEach((header, index) => {
        obj[header] =
          cols[index] !== undefined
            ? cols[index].trim()
            : "";
      });

      result.push(obj);
    }

    return result;
  };

  const preparePastedData = () => {
    const rows = parsePastedData(pasteInput);

    return rows.map((row) => {
      const ogpDateCol = findColumn(row, [
        "OGP Date",
        "OGPDate"
      ]);

      const gateOutDateCol = findColumn(row, [
        "Gate Out Date",
        "GateOut Date",
        "GateOutDate",
        "Gate Out"
      ]);

      const gateCol = findColumn(row, [
        "Gate Pass No",
        "Gate Pass",
        "GatePass No"
      ]);

      const vehicleCol = findColumn(row, [
        "Vehicle No",
        "Vehicle Number"
      ]);

      return {
        ogpDate: ogpDateCol
          ? row[ogpDateCol]
          : "",

        gateOutDate: gateOutDateCol
          ? row[gateOutDateCol]
          : "",

        gatePass: gateCol
          ? row[gateCol]
          : "",

        vehicle: vehicleCol
          ? row[vehicleCol]
          : ""
      };
    });
  };

  const normalizeDateForFilter = (value) => {
    if (
      value === null ||
      value === undefined ||
      String(value).trim() === ""
    ) {
      return "";
    }

    const text = String(value).trim();

    const m = text.match(
      /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/
    );

    if (m) {
      const day = String(m[1]).padStart(2, "0");
      const month = parseInt(m[2], 10);
      const year = m[3];

      const months = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
      ];

      if (month >= 1 && month <= 12) {
        return `${day}-${months[month - 1]}-${year}`;
      }
    }

    const date = new Date(text);

    if (!isNaN(date.getTime())) {
      return formatGateOutDate(date);
    }

    return text;
  };

  const formatGateOutDate = (date) => {
    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const months = [
      "Jan", "Feb", "Mar", "Apr",
      "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec"
    ];

    return `${day}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

  const loadExcel = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(
          e.target.result
        );

        const workbook = XLSX.read(data, {
          type: "array",
          cellDates: true
        });

        const sheet =
          workbook.Sheets[
            workbook.SheetNames[0]
          ];

        const rows =
          XLSX.utils.sheet_to_json(sheet, {
            defval: "",
            raw: false
          });

        setExcelRows(rows);

        setStatusColor("text-green-600");
        setStatus(
          `Excel loaded successfully: ${rows.length} rows.`
        );
      } catch (error) {
        console.error(error);

        setStatusColor("text-red-600");
        setStatus(
          "Error reading Excel file."
        );
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const loadPasteTable = () => {
    const rows = preparePastedData();

    if (!rows.length) {
      setStatusColor("text-red-600");
      setStatus(
        "Please paste valid data first."
      );
      return;
    }

    setInputRows(rows);
    setSelectedDates([]);

    setStatusColor("text-green-600");
    setStatus(
      `${rows.length} rows loaded. You can edit, add or remove rows.`
    );
  };

  const updateInputRow = (index, field, value) => {
    setInputRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? { ...row, [field]: value }
          : row
      )
    );
  };

  const addInputRow = () => {
    setInputRows((prev) => [
      ...prev,
      {
        ogpDate: "",
        gateOutDate: "",
        gatePass: "",
        vehicle: ""
      }
    ]);
  };

  const removeInputRow = (index) => {
    if (!window.confirm("Remove this row?")) {
      return;
    }

    setInputRows((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const clearPaste = () => {
    setPasteInput("");
    setInputRows([]);
    setSelectedDates([]);
    setReport([]);
    setStatus("");
  };

  const clearAll = () => {
    setExcelRows([]);
    setInputRows([]);
    setPasteInput("");
    setSelectedDates([]);
    setReport([]);
    setStatus("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const availableDates = React.useMemo(() => {
    const dates = new Set();
    let hasBlank = false;

    inputRows.forEach((row) => {
      const date = normalizeDateForFilter(
        row.gateOutDate
      );

      if (date) {
        dates.add(date);
      } else {
        hasBlank = true;
      }
    });

    const sorted = [...dates].sort(
      (a, b) => new Date(a) - new Date(b)
    );

    if (hasBlank) {
      sorted.push("__BLANK__");
    }

    return sorted;
  }, [inputRows]);

  const filteredInputRows = React.useMemo(() => {
    if (!selectedDates.length) {
      return inputRows;
    }

    return inputRows.filter((row) => {
      const date = normalizeDateForFilter(
        row.gateOutDate
      );

      if (!date) {
        return selectedDates.includes(
          "__BLANK__"
        );
      }

      return selectedDates.includes(date);
    });
  }, [inputRows, selectedDates]);

  const distinctCount = (rows, field) => {
    const set = new Set();

    rows.forEach((row) => {
      const value = normalize(row[field]);

      if (value) {
        set.add(value);
      }
    });

    return set.size;
  };

  const sumField = (rows, field) => {
    return rows.reduce(
      (total, row) =>
        total + numberValue(row[field]),
      0
    );
  };

  const makeSummary = (label, rows) => ({
    label,
    gatePass: distinctCount(rows, "gatePass"),
    challan: distinctCount(rows, "challan"),
    quantity: sumField(rows, "quantity"),
    netWeight: sumField(rows, "netWeight"),
    bagCtn: sumField(rows, "bagCtn")
  });

  const generateReport = () => {
    if (!excelRows.length) {
      setStatusColor("text-red-600");
      setStatus(
        "Please upload Excel file first."
      );
      return;
    }

    if (!inputRows.length) {
      setStatusColor("text-red-600");
      setStatus(
        "Please load paste data first."
      );
      return;
    }

    if (!filteredInputRows.length) {
      setStatusColor("text-red-600");
      setStatus(
        "No rows available after filter."
      );
      return;
    }

    const pastedData = filteredInputRows.map(
      (row) => ({
        gatePass: String(
          row.gatePass || ""
        ).trim(),

        vehicle: String(
          row.vehicle || ""
        ).trim()
      })
    );

    const excelData =
      prepareExcelData(excelRows);

    const gatePassSet = new Set();
    const vehicleMap = new Map();

    pastedData.forEach((row) => {
      const key = normalize(
        row.gatePass
      );

      if (!key) return;

      gatePassSet.add(key);

      if (!vehicleMap.has(key)) {
        vehicleMap.set(key, []);
      }

      if (row.vehicle) {
        vehicleMap
          .get(key)
          .push(row.vehicle);
      }
    });

    const matchedRows = excelData
      .filter((row) =>
        gatePassSet.has(
          normalize(row.gatePass)
        )
      )
      .map((row) => {
        const key = normalize(
          row.gatePass
        );

        const vehicles = [
          ...new Set(
            (
              vehicleMap.get(key) || []
            ).filter(Boolean)
          )
        ];

        return {
          ...row,
          mappedCustomer:
            getMappedCustomer(
              row.customer,
              row.location
            ),
          matchedVehicles: vehicles
        };
      });

    if (!matchedRows.length) {
      setReport([]);
      setStatusColor("text-red-600");
      setStatus(
        "No matching Gate Pass No found."
      );
      return;
    }

    const vehicleGroups = new Map();

    matchedRows.forEach((row) => {
      let vehicles =
        row.matchedVehicles;

      if (!vehicles.length) {
        vehicles = [
          row.vehicle || "Unknown"
        ];
      }

      vehicles.forEach((vehicle) => {
        const key =
          vehicle.trim() || "Unknown";

        if (!vehicleGroups.has(key)) {
          vehicleGroups.set(key, []);
        }

        vehicleGroups
          .get(key)
          .push(row);
      });
    });

    setReport(
      [...vehicleGroups.entries()]
    );

    setStatusColor("text-green-600");
    setStatus(
      `Report generated successfully. ${matchedRows.length} matching Excel rows found.`
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-5">
      <div className="mx-auto max-w-[1500px]">

        {/* PAGE TITLE */}

        <div className="mb-5 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#123b66]">
            Gate Pass Vehicle Wise Summary
          </h1>
        </div>

        {/* EXCEL */}

        <div className="mb-5 rounded-xl bg-white p-4 sm:p-5 shadow">
          <h2 className="mb-3 text-lg font-bold text-[#174a7a]">
            1. Upload Excel File
          </h2>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={loadExcel}
            className="w-full rounded-lg border border-slate-300 p-2"
          />

          <div
            className={`mt-2 text-sm font-semibold ${statusColor}`}
          >
            {status || "No Excel file selected."}
          </div>
        </div>

        {/* PASTE */}

        <div className="mb-5 rounded-xl bg-white p-4 sm:p-5 shadow">
          <h2 className="mb-3 text-lg font-bold text-[#174a7a]">
            2. Paste Gate Pass Data
          </h2>

          <textarea
            value={pasteInput}
            onChange={(e) =>
              setPasteInput(e.target.value)
            }
            placeholder="Excel থেকে OGP Date, Gate Out Date, Gate Pass No, Vehicle No সহ data copy করে এখানে paste করুন..."
            className="min-h-[180px] w-full resize-y rounded-lg border border-slate-300 p-3 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={loadPasteTable}
              className="rounded-lg bg-green-600 px-5 py-2.5 font-bold text-white hover:bg-green-700"
            >
              Load Paste Data
            </button>

            <button
              onClick={clearPaste}
              className="rounded-lg bg-orange-500 px-5 py-2.5 font-bold text-white hover:bg-orange-600"
            >
              Clear Paste
            </button>
          </div>
        </div>

        {/* INPUT TABLE */}

        {inputRows.length > 0 && (
          <div className="mb-5 rounded-xl bg-white p-4 sm:p-5 shadow">

            <h2 className="mb-4 text-lg font-bold text-[#174a7a]">
              3. Paste Input Table
            </h2>

            <div className="mb-4 rounded-lg border bg-slate-50 p-3">
              <label className="mb-2 block font-bold text-[#174a7a]">
                Gate Out Date
              </label>

              <select
                multiple
                value={selectedDates}
                onChange={(e) =>
                  setSelectedDates(
                    [...e.target.selectedOptions]
                      .map(
                        (option) =>
                          option.value
                      )
                  )
                }
                className="min-h-[110px] w-full rounded-lg border border-slate-300 bg-white p-2"
              >
                {availableDates.map((date) => (
                  <option
                    key={date}
                    value={date}
                  >
                    {date === "__BLANK__"
                      ? "Blank"
                      : date}
                  </option>
                ))}
              </select>

              <small className="mt-1 block text-slate-500">
                একসাথে Date + Blank select করতে Ctrl / Cmd ব্যবহার করুন
              </small>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={addInputRow}
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-bold text-white hover:bg-blue-700"
              >
                + Add Row
              </button>

              <button
                onClick={generateReport}
                className="rounded-lg bg-green-600 px-5 py-2.5 font-bold text-white hover:bg-green-700"
              >
                Generate Report
              </button>

              <button
                onClick={() =>
                  window.print()
                }
                className="rounded-lg bg-slate-700 px-5 py-2.5 font-bold text-white hover:bg-slate-800"
              >
                Print / PDF
              </button>
            </div>

            <div className="max-h-[500px] overflow-auto rounded-lg border">
              <table className="w-full min-w-[900px] border-collapse text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#174a7a] text-white">
                    <th className="border p-2">#</th>
                    <th className="border p-2">
                      OGP Date
                    </th>
                    <th className="border p-2">
                      Gate Out Date
                    </th>
                    <th className="border p-2">
                      Gate Pass No
                    </th>
                    <th className="border p-2">
                      Vehicle No
                    </th>
                    <th className="border p-2">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {inputRows.map(
                    (row, index) => {
                      const date =
                        normalizeDateForFilter(
                          row.gateOutDate
                        );

                      if (
                        selectedDates.length &&
                        !selectedDates.includes(
                          date ||
                            "__BLANK__"
                        )
                      ) {
                        return null;
                      }

                      return (
                        <tr key={index}>
                          <td className="border p-2 text-center font-bold">
                            {index + 1}
                          </td>

                          <td className="border p-1">
                            <input
                              value={
                                row.ogpDate
                              }
                              onChange={(e) =>
                                updateInputRow(
                                  index,
                                  "ogpDate",
                                  e.target.value
                                )
                              }
                              className="w-full min-w-[120px] rounded border p-1.5"
                            />
                          </td>

                          <td className="border p-1">
                            <input
                              value={
                                row.gateOutDate
                              }
                              onChange={(e) =>
                                updateInputRow(
                                  index,
                                  "gateOutDate",
                                  e.target.value
                                )
                              }
                              className="w-full min-w-[120px] rounded border p-1.5"
                            />
                          </td>

                          <td className="border p-1">
                            <input
                              value={
                                row.gatePass
                              }
                              onChange={(e) =>
                                updateInputRow(
                                  index,
                                  "gatePass",
                                  e.target.value
                                )
                              }
                              className="w-full min-w-[120px] rounded border p-1.5"
                            />
                          </td>

                          <td className="border p-1">
                            <input
                              value={
                                row.vehicle
                              }
                              onChange={(e) =>
                                updateInputRow(
                                  index,
                                  "vehicle",
                                  e.target.value
                                )
                              }
                              className="w-full min-w-[120px] rounded border p-1.5"
                            />
                          </td>

                          <td className="border p-1 text-center">
                            <button
                              onClick={() =>
                                removeInputRow(
                                  index
                                )
                              }
                              className="rounded bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REPORT */}

        <div
          id="reportArea"
          className="rounded-xl bg-white p-4 sm:p-5 shadow"
        >
          <div className="mb-5 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-[#123b66]">
              Gate Pass Vehicle Wise Summary
            </h2>

            <p className="text-xs text-slate-500">
              {report.length
                ? `Generated: ${new Date().toLocaleString()}`
                : ""}
            </p>
          </div>

          {!report.length ? (
            <div className="py-10 text-center text-slate-500">
              Generate report to view data
            </div>
          ) : (
            <div>
              {report.map(
                ([vehicle, rows]) => {
                  const vehicleTotal =
                    makeSummary(
                      vehicle,
                      rows
                    );

                  const customerGroups =
                    new Map();

                  rows.forEach((row) => {
                    const customer =
                      row.mappedCustomer ||
                      "Unknown";

                    if (
                      !customerGroups.has(
                        customer
                      )
                    ) {
                      customerGroups.set(
                        customer,
                        []
                      );
                    }

                    customerGroups
                      .get(customer)
                      .push(row);
                  });

                  return (
                    <div
                      key={vehicle}
                      className="mb-5 break-inside-avoid"
                    >
                      <div className="rounded-t-lg bg-[#174a7a] px-3 py-2 font-bold text-white">
                        Vehicle: {vehicle}
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] border-collapse text-xs">
                          <tbody>
                            <tr className="bg-[#dceaf7] font-bold text-[#123b66]">
                              <td className="border border-slate-400 p-2">
                                {vehicleTotal.label}
                              </td>

                              <td className="border border-slate-400 p-2 text-right">
                                Gatepass ={" "}
                                {formatNumber(
                                  vehicleTotal.gatePass
                                )}
                              </td>

                              <td className="border border-slate-400 p-2 text-right">
                                Challan ={" "}
                                {formatNumber(
                                  vehicleTotal.challan
                                )}
                              </td>

                              <td className="border border-slate-400 p-2 text-right">
                                Quantity ={" "}
                                {formatNumber(
                                  vehicleTotal.quantity
                                )}
                              </td>

                              <td className="border border-slate-400 p-2 text-right">
                                Net Weight ={" "}
                                {formatNumber(
                                  vehicleTotal.netWeight
                                )}
                              </td>

                              <td className="border border-slate-400 p-2 text-right">
                                Bag/Ctn ={" "}
                                {formatNumber(
                                  vehicleTotal.bagCtn
                                )}
                              </td>
                            </tr>

                            {[...customerGroups.entries()].map(
                              ([customer, customerRows]) => {
                                const customerSummary =
                                  makeSummary(
                                    customer,
                                    customerRows
                                  );

                                const gateGroups =
                                  new Map();

                                customerRows.forEach(
                                  (row) => {
                                    const gate =
                                      row.gatePass ||
                                      "Unknown";

                                    if (
                                      !gateGroups.has(
                                        gate
                                      )
                                    ) {
                                      gateGroups.set(
                                        gate,
                                        []
                                      );
                                    }

                                    gateGroups
                                      .get(gate)
                                      .push(row);
                                  }
                                );

                                return (
                                  <React.Fragment
                                    key={customer}
                                  >
                                    <tr className="bg-slate-50 font-bold">
                                      <td className="border border-slate-400 p-2 pl-4">
                                        {customerSummary.label}
                                      </td>

                                      <td className="border border-slate-400 p-2 text-right">
                                        {formatNumber(
                                          customerSummary.gatePass
                                        )}
                                      </td>

                                      <td className="border border-slate-400 p-2 text-right">
                                        {formatNumber(
                                          customerSummary.challan
                                        )}
                                      </td>

                                      <td className="border border-slate-400 p-2 text-right">
                                        {formatNumber(
                                          customerSummary.quantity
                                        )}
                                      </td>

                                      <td className="border border-slate-400 p-2 text-right">
                                        {formatNumber(
                                          customerSummary.netWeight
                                        )}
                                      </td>

                                      <td className="border border-slate-400 p-2 text-right">
                                        {formatNumber(
                                          customerSummary.bagCtn
                                        )}
                                      </td>
                                    </tr>

                                    {[...gateGroups.entries()].map(
                                      ([gate, gateRows]) => {
                                        const summary =
                                          makeSummary(
                                            gate,
                                            gateRows
                                          );

                                        return (
                                          <tr key={gate}>
                                            <td className="border border-slate-400 p-2 pl-7">
                                              {summary.label}
                                            </td>

                                            <td className="border border-slate-400 p-2 text-right">
                                              {formatNumber(
                                                summary.gatePass
                                              )}
                                            </td>

                                            <td className="border border-slate-400 p-2 text-right">
                                              {formatNumber(
                                                summary.challan
                                              )}
                                            </td>

                                            <td className="border border-slate-400 p-2 text-right">
                                              {formatNumber(
                                                summary.quantity
                                              )}
                                            </td>

                                            <td className="border border-slate-400 p-2 text-right">
                                              {formatNumber(
                                                summary.netWeight
                                              )}
                                            </td>

                                            <td className="border border-slate-400 p-2 text-right">
                                              {formatNumber(
                                                summary.bagCtn
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </React.Fragment>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={clearAll}
            className="rounded-lg bg-red-600 px-5 py-2.5 font-bold text-white hover:bg-red-700"
          >
            Clear All
          </button>
        </div>

      </div>
    </div>
  );
}
