import React, { useEffect, useMemo, useRef, useState } from "react";

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
  ["JINNAT FASHIONS LTD. Mawna Fashions Ltd ,Tepir Bari, Sreepur, Gazipur, Bangladesh", "MAWNA"],
  ["MATIN SPINNING MILLS PLC SARDAGONJ, KASHIMPUR, GAZIPUR", "MATIN"],
  ["FLAMINGO FASHIONS LTD. (JKL-U2-1)_JINNAT KNITWEARS LTD", "JKL-2"],
  ["FOOTBED FOOTWEAR LTD. ULOSHARA, KAI.IAKOI R, GAZIPUR", "FOOTBED"],
  ["DBL CERAMICS LTD. MAWNA, SREEPUR, GAZIPUR", "CERAMICS"],
  ["UTAH FASHIONS LTD 1st-6th Floor, South Shalna, PO: Shalna Bazar, PS: Gazipur Sadar, Gazipur, Bangladesh.", "UTAH FASHION"],
  ["JINNAT KNITWEARS LTD. (JKL-U2-1)_JINNAT KNITWEARS LTD.", "JKL-2"],
  ["GLORY TEXTILES & APPARELS LTD. Kharuail, Ward No-7, Bhaluka Municipal Area Mymensingh 2240 BANGLADESH", "GLORY"],
  ["EU DESIGN, HK LTD. UNITS 1901-1906, 19/F, METRO LOFT, NO. 38 KWAI HEI STREET, KWAI CHUNG, N. T.", "EU DESIGN"],
  ["FLAMINGO FASHIONS LTD. (JKL-U2-4)_JINNAT KNITWEARS LTD", "JKL-2"],
  ["PARKWAY PACKAGING & PRINTING PLC SARDAGONJ, KASHIMPUR, GAZIPUR", "PARKWAY"],
  ["TEXTILE TESTING SERVICES LTD. NAYAPARA, KASHIMPUR, GAZIPUR, 1712", "TTSL"],
  ["UTAH KNITTING & DYEING LTD( Garments Division ) Vill:Bokran Monipur, P.O.Bhabanipur, P.S.Gazipur Sadar, Dist: Gazipur, Bangladesh", "UTAH KNITING"],
  ["JINNAT KNITWEARS LTD. (MFL)_MAWNA FASHIONS LTD.", "MAWNA"],
  ["MEHNAZ STYLES & CRAFT LTD. Industry SL No-56, Ward-06 | Tongabari Ashulia, Savar, Dhaka", "MEHNAZ"],
  ["COLOR CITY LTD. NAYAPARA, KASHIMPUR, GAZIPUR", "COLOR"],
  ["MAWNA FASHIONS LTD. (JKL-U2-2)_JINNAT KNITWEARS LTD.", "JKL-2"],
  ["JINNAT APPARELS LTD. SARDAGONJ, KASHIMPUR, GAZIPUR", "JINNAT"],
  ["FLAMINGO FASHIONS LTD. (JAL)_JINNAT APPARELS LTD", "JINNAT"],
  ["EUDB ACCESSORIES LIMITED SARDAGONJ, KASHIMPUR, GAZIPUR", "EUDB"],
  ["DB TEX LTD. NAYAPARA, KASHIMPUR, GAZIPUR", "DB TEX"],
  ["Nuovo Shoes (BD) Ltd. BUILDING.B,PLOT#81-B2,WEST -PADARDIA,SATAKUL,ROAD.SATAKUL-294, DHAKA,", "NUOVO SHOES"],
  ["OMC FOOTWEAR LIMITED Nalpathor, Kanchan, Rupgonj, Narayanganj-1461, Bangladesh", "OMC"],
  ["HAMZA TEXTILES LTD. SARDAGONJ, KASHIMPUR, GAZIPUR", "HAMZA"],
  ["COMFIT COMPOSITE KNIT LTD. GORAI, MIRZAPUR, TANGAIL", "COMFIT"],
  ["Fabrica Knit Composite Ltd. Jamgora, Asulia, Dhaka", "FAVRICA"],
  ["FLAMINGO FASHIONS LTD. Glory Textile & Apparels Ltd.", "GLORY"],
  ["Fabrica Knit Composite Ltd. FNF Trend Fashion Ltd", "FAVRICA"],
  ["DBL Pharmaceuticals Ltd. DEWAN BARI, KASHIMPUR, GAZIPUR", "PRHARMA"],
  ["JINNAT KNITWEARS LTD. (MFL-1)_MAWNA FASHIONS LTD", "MAWNA"],
  ["JINNAT KNITWEARS LTD. (FFL2-2)_FLAMINGO FASHIONS LTD.", "FFL2"],
  ["FLAMINGO FASHIONS LTD. (FFL2-4)_FLAMINGO FASHIONS LTD.", "FFL2"],
  ["FLAMINGO FASHIONS LTD. (JKL-U2-3)_JINNAT KNITWEARS LTD.", "JKL-2"],
  ["MATRIGHOR LIMITED. Shingair Road, Hemayetpur, Tetuljhora, Savar, Dhaka-1340", "MATRIGH"],
  ["FLAMINGO FASHIONS LTD. (JAL-1)_JINNAT APPARELS LTD", "JINNAT"],
  ["JINNAT KNITWEARS LTD. (JKL-U2-4)_JINNAT KNITWEARS LTD.", "JKL-2"],
  ["FLAMINGO FASHIONS LTD. (FFL2-5)_FLAMINGO FASHIONS LTD.", "FFL2"],
  ["MAWNA FASHIONS LTD. (MFL)_MAWNA FASHIONS LTD.", "MAWNA"],
  ["JINNAT KNITWEARS LTD (JKL)_JINNAT KNITWEARS LTD.", "JINNAT"],
  ["T.K. FOOTWEAR LIMITED. 4, CDA INDUSTRIAL AREA, CHANDGAON,KALURGHAT, CHITTAGONG, BANGLADESH", "T.K. FOOTWEAR"],
  ["JINNAT KNITWEARS LTD. (JKL-U2-3)_JINNAT KNITWEARS LTD.", "JKL-2"],
  ["FLAMINGO FASHIONS LTD. (JKL-1)_JINNAT KNITWEARS LTD.", "JINNAT"],
  ["JINNAT KNITWEARS LTD. (JKL)_JINNAT KNITWEARS LTD.", "JINNAT"],
  ["Jinnat Textile Mills Ltd. (JTML) Shreehatta Economic Zone, Sherpur, Moulvibazar", "Jinnat Textile"],
];

function normalize(value) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function numberValue(value) {
  if (value === null || value === undefined || value === "") return 0;

  const text = String(value)
    .replace(/,/g, "")
    .replace(/[^\d.-]/g, "");

  const num = parseFloat(text);

  return Number.isNaN(num) ? 0 : num;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return "0";

  return Number(value).toLocaleString("en-US", {
    maximumFractionDigits: 3,
  });
}

function findColumn(row, names) {
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
}

function normalizeDateForFilter(value) {
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
    const monthNumber = parseInt(m[2], 10);
    const year = m[3];

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    if (monthNumber >= 1 && monthNumber <= 12) {
      return `${day}-${months[monthNumber - 1]}-${year}`;
    }
  }

  const date = new Date(text);

  if (!Number.isNaN(date.getTime())) {
    return formatGateOutDate(date);
  }

  return text;
}

function formatGateOutDate(date) {
  const day = String(date.getDate()).padStart(2, "0");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${day}-${months[date.getMonth()]}-${date.getFullYear()}`;
}

function getMappedCustomer(customer, location) {
  const combined = normalize(
    `${customer} ${location}`
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
    [/JINNAT KNITWEARS.*FFL2/, "FFL2"],
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
    [/FB FOOTWEAR/, "FB"],
  ];

  for (const [regex, value] of checks) {
    if (regex.test(combined)) {
      return value;
    }
  }

  return customer || "Unknown";
}

function prepareExcelData(excelRows) {
  return excelRows.map((row) => {
    const gateCol = findColumn(row, [
      "Gate Pass No",
      "Gate Pass",
      "GatePass No",
    ]);

    const challanCol = findColumn(row, [
      "Challan No",
      "Challan",
    ]);

    const qtyCol = findColumn(row, [
      "Quantity",
      "Qty",
    ]);

    const weightCol = findColumn(row, [
      "Net Weight",
      "NetWeight",
      "Weight",
    ]);

    const bagCol = findColumn(row, [
      "Bag/Ctn",
      "Bag Ctn",
      "Bag/Ctns",
      "Bag",
    ]);

    const customerCol = findColumn(row, [
      "Customer Name",
      "Customer",
      "Buyer Name",
    ]);

    const locationCol = findColumn(row, [
      "Delilocation",
      "Delivery Location",
      "DeliveryLocation",
      "Location",
    ]);

    const vehicleCol = findColumn(row, [
      "Vehicle No",
      "Vehicle Number",
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
        : "",
    };
  });
}

function parsePastedData(text) {
  if (!text.trim()) return [];

  const lines = text
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter((x) => x !== "");

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
    .map((x) => normalize(x));

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
}

function preparePastedData(text) {
  const rows = parsePastedData(text);

  return rows.map((row) => {
    const ogpDateCol = findColumn(row, [
      "OGP Date",
      "OGPDate",
    ]);

    const gateOutDateCol = findColumn(row, [
      "Gate Out Date",
      "GateOut Date",
      "GateOutDate",
      "Gate Out",
    ]);

    const gateCol = findColumn(row, [
      "Gate Pass No",
      "Gate Pass",
      "GatePass No",
    ]);

    const vehicleCol = findColumn(row, [
      "Vehicle No",
      "Vehicle Number",
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
        : "",
    };
  });
}

function getMatchedRows(excelData, pastedData) {
  const gatePassSet = new Set();
  const vehicleMap = new Map();

  pastedData.forEach((row) => {
    const key = normalize(row.gatePass);

    if (!key) return;

    gatePassSet.add(key);

    if (!vehicleMap.has(key)) {
      vehicleMap.set(key, []);
    }

    if (row.vehicle) {
      vehicleMap.get(key).push(row.vehicle);
    }
  });

  return excelData
    .filter((row) =>
      gatePassSet.has(
        normalize(row.gatePass)
      )
    )
    .map((row) => {
      const key = normalize(row.gatePass);

      const vehicles = [
        ...new Set(
          (vehicleMap.get(key) || []).filter(Boolean)
        ),
      ];

      return {
        ...row,

        mappedCustomer: getMappedCustomer(
          row.customer,
          row.location
        ),

        matchedVehicles: vehicles,
      };
    });
}

function distinctCount(rows, field) {
  const set = new Set();

  rows.forEach((row) => {
    const value = normalize(row[field]);

    if (value) {
      set.add(value);
    }
  });

  return set.size;
}

function sumField(rows, field) {
  return rows.reduce(
    (total, row) =>
      total + numberValue(row[field]),
    0
  );
}

function makeSummary(label, rows) {
  return {
    label,

    gatePass: distinctCount(
      rows,
      "gatePass"
    ),

    challan: distinctCount(
      rows,
      "challan"
    ),

    quantity: sumField(
      rows,
      "quantity"
    ),

    netWeight: sumField(
      rows,
      "netWeight"
    ),

    bagCtn: sumField(
      rows,
      "bagCtn"
    ),
  };
}

function Button({
  children,
  color = "blue",
  onClick,
  type = "button",
}) {
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-emerald-600 hover:bg-emerald-700",
    orange: "bg-orange-500 hover:bg-orange-600",
    red: "bg-red-600 hover:bg-red-700",
    dark: "bg-gray-700 hover:bg-gray-800",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-md px-4 py-2.5 text-sm font-bold text-white transition ${colors[color]}`}
    >
      {children}
    </button>
  );
}

function SummaryRow({
  summary,
  type = "total",
}) {
  const isTotal = type === "total";

  return (
    <tr
      className={
        isTotal
          ? "bg-[#dceaf7] font-bold text-[#123b66]"
          : "bg-[#f7f9fb] font-bold"
      }
    >
      <td className="border border-slate-400 px-2 py-1.5 text-left whitespace-nowrap">
        {summary.label}
      </td>

      <td className="border border-slate-400 px-2 py-1.5 text-right whitespace-nowrap">
        {isTotal
          ? `Gatepass = ${formatNumber(
              summary.gatePass
            )}`
          : formatNumber(summary.gatePass)}
      </td>

      <td className="border border-slate-400 px-2 py-1.5 text-right whitespace-nowrap">
        {isTotal
          ? `Challan = ${formatNumber(
              summary.challan
            )}`
          : formatNumber(summary.challan)}
      </td>

      <td className="border border-slate-400 px-2 py-1.5 text-right whitespace-nowrap">
        {isTotal
          ? `Quantity = ${formatNumber(
              summary.quantity
            )}`
          : formatNumber(summary.quantity)}
      </td>

      <td className="border border-slate-400 px-2 py-1.5 text-right whitespace-nowrap">
        {isTotal
          ? `Net Weight = ${formatNumber(
              summary.netWeight
            )}`
          : formatNumber(summary.netWeight)}
      </td>

      <td className="border border-slate-400 px-2 py-1.5 text-right whitespace-nowrap">
        {isTotal
          ? `Bag/Ctn = ${formatNumber(
              summary.bagCtn
            )}`
          : formatNumber(summary.bagCtn)}
      </td>
    </tr>
  );
}

export default function VehicleSummary() {
  const [excelRows, setExcelRows] = useState([]);
  const [inputRows, setInputRows] = useState([]);
  const [pasteInput, setPasteInput] = useState("");

  const [selectedDates, setSelectedDates] = useState(
    []
  );

  const [fileStatus, setFileStatus] = useState(
    "No Excel file selected."
  );

  const [pasteStatus, setPasteStatus] = useState("");
  const [statusColor, setStatusColor] =
    useState("gray");

  const [reportGroups, setReportGroups] =
    useState([]);

  const [reportDate, setReportDate] =
    useState("");

  const fileRef = useRef(null);

  const availableDates = useMemo(() => {
    const dates = new Set();
    let hasBlank = false;

    inputRows.forEach((row) => {
      const formatted =
        normalizeDateForFilter(
          row.gateOutDate
        );

      if (formatted) {
        dates.add(formatted);
      } else {
        hasBlank = true;
      }
    });

    const sortedDates = [...dates].sort(
      (a, b) => {
        const parse = (x) => {
          const parts = x.split("-");

          if (parts.length !== 3) {
            return new Date(x);
          }

          const monthMap = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
          };

          return new Date(
            Number(parts[2]),
            monthMap[parts[1]],
            Number(parts[0])
          );
        };

        return parse(a) - parse(b);
      }
    );

    if (hasBlank) {
      sortedDates.push("__BLANK__");
    }

    return sortedDates;
  }, [inputRows]);

  const filteredInputRows = useMemo(() => {
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

  useEffect(() => {
    const validDates = new Set(
      availableDates
    );

    setSelectedDates((old) =>
      old.filter((date) =>
        validDates.has(date)
      )
    );
  }, [availableDates]);

  useEffect(() => {
    const handlePrint = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "p"
      ) {
        e.preventDefault();
        handlePrintPDF();
      }
    };

    document.addEventListener(
      "keydown",
      handlePrint
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handlePrint
      );
    };
  });

  function handleExcelUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(
          e.target.result
        );

        if (!window.XLSX) {
          throw new Error(
            "XLSX library not found."
          );
        }

        const workbook = window.XLSX.read(
          data,
          {
            type: "array",
            cellDates: true,
          }
        );

        const sheet =
          workbook.Sheets[
            workbook.SheetNames[0]
          ];

        const rows =
          window.XLSX.utils.sheet_to_json(
            sheet,
            {
              defval: "",
              raw: false,
            }
          );

        setExcelRows(rows);

        setFileStatus(
          `Excel loaded successfully: ${rows.length} rows.`
        );
        setStatusColor("green");
      } catch (error) {
        console.error(error);

        setFileStatus(
          "Error reading Excel file."
        );
        setStatusColor("red");
      }
    };

    reader.readAsArrayBuffer(file);
  }

  function loadPasteTable() {
    const rows =
      preparePastedData(pasteInput);

    if (!rows.length) {
      setPasteStatus(
        "Please paste valid data first."
      );
      setStatusColor("red");
      return;
    }

    setInputRows(rows);
    setSelectedDates([]);

    setPasteStatus(
      `${rows.length} rows loaded. You can edit, add or remove rows.`
    );

    setStatusColor("green");
  }

  function updateInputRow(
    index,
    field,
    value
  ) {
    setInputRows((oldRows) =>
      oldRows.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  }

  function addInputRow() {
    setInputRows((oldRows) => [
      ...oldRows,
      {
        ogpDate: "",
        gateOutDate: "",
        gatePass: "",
        vehicle: "",
      },
    ]);
  }

  function removeInputRow(index) {
    if (!window.confirm("Remove this row?")) {
      return;
    }

    setInputRows((oldRows) =>
      oldRows.filter((_, i) => i !== index)
    );
  }

  function handleDateFilterChange(event) {
    const values = Array.from(
      event.target.selectedOptions
    ).map((option) => option.value);

    setSelectedDates(values);
  }

  function generateReport() {
    if (!excelRows.length) {
      setPasteStatus(
        "Please upload Excel file first."
      );
      setStatusColor("red");
      return;
    }

    if (!inputRows.length) {
      setPasteStatus(
        "Please load paste data first."
      );
      setStatusColor("red");
      return;
    }

    if (!filteredInputRows.length) {
      setPasteStatus(
        "No rows available after filter."
      );
      setStatusColor("red");
      return;
    }

    const pastedData =
      filteredInputRows.map((row) => ({
        gatePass: String(
          row.gatePass || ""
        ).trim(),

        vehicle: String(
          row.vehicle || ""
        ).trim(),
      }));

    const excelData =
      prepareExcelData(excelRows);

    const matchedRows =
      getMatchedRows(
        excelData,
        pastedData
      );

    if (!matchedRows.length) {
      setReportGroups([]);
      setPasteStatus(
        "No matching Gate Pass No found."
      );
      setStatusColor("red");
      return;
    }

    const vehicleGroups = new Map();

    matchedRows.forEach((row) => {
      let vehicles = row.matchedVehicles;

      if (!vehicles.length) {
        vehicles = [
          row.vehicle || "Unknown",
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

    setReportGroups(
      Array.from(vehicleGroups.entries())
    );

    setReportDate(
      `Generated: ${new Date().toLocaleString()}`
    );

    setPasteStatus(
      `Report generated successfully. ${matchedRows.length} matching Excel rows found.`
    );

    setStatusColor("green");
  }

  function handlePrintPDF() {
    if (!reportGroups.length) {
      window.alert(
        "Please generate report first."
      );
      return;
    }

    window.print();
  }

  function clearPaste() {
    setPasteInput("");
    setInputRows([]);
    setSelectedDates([]);
    setPasteStatus("");
    setReportGroups([]);
    setReportDate("");
  }

  function clearAll() {
    setExcelRows([]);
    setInputRows([]);
    setPasteInput("");
    setSelectedDates([]);
    setReportGroups([]);
    setReportDate("");
    setFileStatus(
      "No Excel file selected."
    );
    setPasteStatus("");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f6fa] p-5 text-[#17202a] print:bg-white print:p-0">
      <div className="mx-auto max-w-[1500px]">
        {/* INPUT AREA */}
        <div className="print:hidden">
          <h1 className="mb-5 text-center text-2xl font-bold text-[#123b66]">
            Gate Pass Vehicle Wise Summary
          </h1>

          {/* EXCEL UPLOAD */}
          <div className="mb-[18px] rounded-[10px] bg-white p-[18px] shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
            <h2 className="mb-3 text-lg font-bold text-[#174a7a]">
              1. Upload Excel File
            </h2>

            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleExcelUpload}
              className="w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm"
            />

            <div
              className={`mt-2.5 text-sm font-bold ${
                statusColor === "green"
                  ? "text-emerald-600"
                  : statusColor === "red"
                  ? "text-red-600"
                  : "text-slate-600"
              }`}
            >
              {fileStatus}
            </div>
          </div>

          {/* PASTE */}
          <div className="mb-[18px] rounded-[10px] bg-white p-[18px] shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
            <h2 className="mb-3 text-lg font-bold text-[#174a7a]">
              2. Paste Gate Pass Data
            </h2>

            <textarea
              value={pasteInput}
              onChange={(e) =>
                setPasteInput(e.target.value)
              }
              placeholder="Excel থেকে OGP Date, Gate Out Date, Gate Pass No, Vehicle No সহ data copy করে এখানে paste করুন..."
              className="min-h-[180px] w-full resize-y rounded-md border border-slate-300 p-3 font-mono text-[13px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <div className="mt-3 flex flex-wrap gap-2.5">
              <Button
                color="green"
                onClick={loadPasteTable}
              >
                Load Paste Data
              </Button>

              <Button
                color="orange"
                onClick={clearPaste}
              >
                Clear Paste
              </Button>
            </div>

            {pasteStatus && (
              <div
                className={`mt-2.5 text-sm font-bold ${
                  statusColor === "green"
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {pasteStatus}
              </div>
            )}
          </div>

          {/* INPUT TABLE */}
          {inputRows.length > 0 && (
            <div className="mb-[18px] rounded-[10px] bg-white p-[18px] shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
              <h2 className="mb-3 text-lg font-bold text-[#174a7a]">
                3. Paste Input Table
              </h2>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(240px,1fr)_auto]">
                <div className="rounded-md border border-slate-300 bg-slate-50 p-2.5">
                  <label className="mb-1.5 block text-sm font-bold text-[#174a7a]">
                    Gate Out Date
                  </label>

                  <select
                    multiple
                    value={selectedDates}
                    onChange={
                      handleDateFilterChange
                    }
                    className="min-h-[110px] w-full rounded-md border border-slate-300 bg-white p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    {availableDates.map(
                      (date) => (
                        <option
                          key={date}
                          value={date}
                        >
                          {date ===
                          "__BLANK__"
                            ? "Blank"
                            : date}
                        </option>
                      )
                    )}
                  </select>

                  <small className="mt-1 block text-xs text-slate-500">
                    একসাথে Date + Blank select
                    করতে Ctrl / Cmd ব্যবহার
                    করুন
                  </small>
                </div>

                <div className="flex items-end gap-2.5">
                  <Button
                    color="blue"
                    onClick={addInputRow}
                  >
                    + Add Row
                  </Button>

                  <Button
                    color="green"
                    onClick={generateReport}
                  >
                    Generate Report
                  </Button>
                </div>
              </div>

              <div className="mt-4 max-h-[500px] overflow-auto rounded-md border border-slate-300">
                <table className="w-full border-collapse bg-white text-xs">
                  <thead>
                    <tr>
                      <th className="sticky top-0 z-10 w-[45px] border border-[#0e3457] bg-[#174a7a] px-2 py-2 text-white">
                        #
                      </th>

                      <th className="sticky top-0 z-10 border border-[#0e3457] bg-[#174a7a] px-2 py-2 text-white">
                        OGP Date
                      </th>

                      <th className="sticky top-0 z-10 border border-[#0e3457] bg-[#174a7a] px-2 py-2 text-white">
                        Gate Out Date
                      </th>

                      <th className="sticky top-0 z-10 border border-[#0e3457] bg-[#174a7a] px-2 py-2 text-white">
                        Gate Pass No
                      </th>

                      <th className="sticky top-0 z-10 border border-[#0e3457] bg-[#174a7a] px-2 py-2 text-white">
                        Vehicle No
                      </th>

                      <th className="sticky top-0 z-10 border border-[#0e3457] bg-[#174a7a] px-2 py-2 text-white">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredInputRows.map(
                      (row) => {
                        const originalIndex =
                          inputRows.indexOf(
                            row
                          );

                        return (
                          <tr
                            key={`${originalIndex}-${row.gatePass}`}
                          >
                            <td className="border border-slate-300 px-2 py-1 text-center font-bold text-slate-600">
                              {originalIndex +
                                1}
                            </td>

                            <td className="border border-slate-300 p-1">
                              <input
                                type="text"
                                value={
                                  row.ogpDate
                                }
                                onChange={(e) =>
                                  updateInputRow(
                                    originalIndex,
                                    "ogpDate",
                                    e.target
                                      .value
                                  )
                                }
                                className="min-w-[120px] w-full rounded border border-slate-200 p-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
                              />
                            </td>

                            <td className="border border-slate-300 p-1">
                              <input
                                type="text"
                                value={
                                  row.gateOutDate
                                }
                                onChange={(e) =>
                                  updateInputRow(
                                    originalIndex,
                                    "gateOutDate",
                                    e.target
                                      .value
                                  )
                                }
                                className="min-w-[120px] w-full rounded border border-slate-200 p-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
                              />
                            </td>

                            <td className="border border-slate-300 p-1">
                              <input
                                type="text"
                                value={
                                  row.gatePass
                                }
                                onChange={(e) =>
                                  updateInputRow(
                                    originalIndex,
                                    "gatePass",
                                    e.target
                                      .value
                                  )
                                }
                                className="min-w-[120px] w-full rounded border border-slate-200 p-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
                              />
                            </td>

                            <td className="border border-slate-300 p-1">
                              <input
                                type="text"
                                value={
                                  row.vehicle
                                }
                                onChange={(e) =>
                                  updateInputRow(
                                    originalIndex,
                                    "vehicle",
                                    e.target
                                      .value
                                  )
                                }
                                className="min-w-[120px] w-full rounded border border-slate-200 p-1.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
                              />
                            </td>

                            <td className="border border-slate-300 p-1 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  removeInputRow(
                                    originalIndex
                                  )
                                }
                                className="rounded bg-red-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-red-700"
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
        </div>

        {/* REPORT */}
        <div
          id="reportArea"
          className="rounded-[10px] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.08)] print:w-full print:rounded-none print:p-0 print:shadow-none"
        >
          <div className="mb-4 text-center print:mb-2">
            <h2 className="m-0 text-[23px] font-bold text-[#123b66] print:text-lg">
              Gate Pass Vehicle Wise Summary
            </h2>

            {reportDate && (
              <p className="mt-1 text-xs text-slate-500 print:text-[8px]">
                {reportDate}
              </p>
            )}
          </div>

          {!reportGroups.length ? (
            <div className="py-6 text-center text-slate-500">
              Generate report to view data
            </div>
          ) : (
            <div>
              {reportGroups.map(
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
                      className="mb-5 break-inside-avoid print:mb-2"
                    >
                      <div className="rounded-t bg-[#174a7a] px-2.5 py-2 text-[15px] font-bold text-white print:px-1.5 print:py-1 print:text-[10px]">
                        Vehicle: {vehicle}
                      </div>

                      <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse text-xs print:text-[8px]">
                          <tbody>
                            <SummaryRow
                              summary={
                                vehicleTotal
                              }
                              type="total"
                            />

                            {Array.from(
                              customerGroups.entries()
                            ).map(
                              ([
                                customer,
                                customerRows,
                              ]) => {
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
                                      .push(
                                        row
                                      );
                                  }
                                );

                                return (
                                  <React.Fragment
                                    key={
                                      customer
                                    }
                                  >
                                    <SummaryRow
                                      summary={
                                        customerSummary
                                      }
                                      type="customer"
                                    />

                                    {Array.from(
                                      gateGroups.entries()
                                    ).map(
                                      ([
                                        gate,
                                        gateRows,
                                      ]) => {
                                        const gateSummary =
                                          makeSummary(
                                            gate,
                                            gateRows
                                          );

                                        return (
                                          <tr
                                            key={
                                              gate
                                            }
                                            className="bg-white"
                                          >
                                            <td className="border border-slate-400 px-2 py-1.5 text-left whitespace-nowrap pl-7 print:px-1 print:py-1 print:pl-5">
                                              {
                                                gateSummary.label
                                              }
                                            </td>

                                            <td className="border border-slate-400 px-2 py-1.5 text-right whitespace-nowrap">
                                              {formatNumber(
                                                gateSummary.gatePass
                                              )}
                                            </td>

                                            <td className="border border-slate-400 px-2 py-1.5 text-right whitespace-nowrap">
                                              {formatNumber(
                                                gateSummary.challan
                                              )}
                                            </td>

                                            <td className="border border-slate-400 px-2 py-1.5 text-right whitespace-nowrap">
                                              {formatNumber(
                                                gateSummary.quantity
                                              )}
                                            </td>

                                            <td className="border border-slate-400 px-2 py-1.5 text-right whitespace-nowrap">
                                              {formatNumber(
                                                gateSummary.netWeight
                                              )}
                                            </td>

                                            <td className="border border-slate-400 px-2 py-1.5 text-right whitespace-nowrap">
                                              {formatNumber(
                                                gateSummary.bagCtn
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

          {/* PRINT BUTTON */}
          {reportGroups.length > 0 && (
            <div className="mt-5 flex justify-end gap-2 print:hidden">
              <Button
                color="blue"
                onClick={handlePrintPDF}
              >
                Print / Save PDF
              </Button>

              <Button
                color="red"
                onClick={clearAll}
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* PRINT STYLES */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 7mm;
          }

          html,
          body {
            width: 210mm;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          table {
            page-break-inside: auto;
          }

          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      `}</style>
    </div>
  );
}
