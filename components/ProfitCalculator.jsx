const { useState } = React;

const createEmptyRow = () => ({
  date: "",
  purchaseQty: 0,
  unitCost: 0,
  deliveryCost: 0,
  saleQty: 0,
  salePrice: 0,
});

function ProfitCalculator() {
  const [rows, setRows] = useState([createEmptyRow()]);
  const [results, setResults] = useState([]);
  const [calculated, setCalculated] = useState(false);

  const numberValue = (value) => {
    const num = parseFloat(value);
    return Number.isFinite(num) ? num : 0;
  };

  const addRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
    setCalculated(false);
  };

  const removeRow = (index) => {
    if (rows.length === 1) {
      setRows([createEmptyRow()]);
      setResults([]);
      setCalculated(false);
      return;
    }

    setRows((prev) => prev.filter((_, i) => i !== index));
    setCalculated(false);
  };

  const updateRow = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? { ...row, [field]: value }
          : row
      )
    );

    setCalculated(false);
  };

  const calculateRows = () => {
    return rows.map((row) => {
      const purchaseQty = numberValue(row.purchaseQty);
      const unitCost = numberValue(row.unitCost);
      const deliveryCost = numberValue(row.deliveryCost);
      const saleQty = numberValue(row.saleQty);
      const salePrice = numberValue(row.salePrice);

      const lotCost =
        purchaseQty * unitCost + deliveryCost;

      const lotSale =
        saleQty * salePrice;

      const lotProfit =
        lotSale - lotCost;

      const perSaleProfit =
        saleQty > 0
          ? lotProfit / saleQty
          : 0;

      return {
        ...row,
        purchaseQty,
        unitCost,
        deliveryCost,
        saleQty,
        salePrice,
        lotCost,
        lotSale,
        lotProfit,
        perSaleProfit,
      };
    });
  };

  const calculateProfit = () => {
    const calculatedRows = calculateRows();

    setResults(calculatedRows);
    setCalculated(true);
  };

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    );
  };

  const totalCost = results.reduce(
    (sum, row) => sum + row.lotCost,
    0
  );

  const totalSale = results.reduce(
    (sum, row) => sum + row.lotSale,
    0
  );

  const totalProfit =
    totalSale - totalCost;

  const totalSaleQty = results.reduce(
    (sum, row) => sum + row.saleQty,
    0
  );

  const overallPerSaleProfit =
    totalSaleQty > 0
      ? totalProfit / totalSaleQty
      : 0;

  const csvEscape = (value) => {
    const text = String(value ?? "");

    if (
      text.includes(",") ||
      text.includes('"') ||
      text.includes("\n")
    ) {
      return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
  };

  const exportCSV = () => {
    const data =
      results.length > 0
        ? results
        : calculateRows();

    let csvContent =
      "Date,Purchase Qty,Unit Cost,Delivery Cost,Sale Qty,Sale Price,Lot Cost,Lot Sale,Lot Profit,Per Sale Profit\n";

    data.forEach((row) => {
      csvContent +=
        [
          row.date || "N/A",
          row.purchaseQty,
          row.unitCost,
          row.deliveryCost,
          row.saleQty,
          row.salePrice,
          row.lotCost,
          row.lotSale,
          row.lotProfit,
          Number(row.perSaleProfit).toFixed(2),
        ]
          .map(csvEscape)
          .join(",") + "\n";
    });

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "profit_data.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setRows([createEmptyRow()]);
    setResults([]);
    setCalculated(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-3 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Multi-Lot Profit Calculator
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Calculate lot cost, sale, profit and per sale profit
          </p>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-lg">

          <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Profit Entries
              </h2>

              <p className="text-sm text-slate-500">
                Add multiple purchase/sale lots
              </p>
            </div>

            <button
              type="button"
              onClick={addRow}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              ➕ Add Entry
            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="min-w-[1300px] w-full border-collapse text-sm">

              <thead>
                <tr className="bg-blue-600 text-white">

                  <th className="border border-blue-500 px-3 py-3">#</th>
                  <th className="border border-blue-500 px-3 py-3">Date</th>
                  <th className="border border-blue-500 px-3 py-3">Purchase Qty</th>
                  <th className="border border-blue-500 px-3 py-3">Unit Cost</th>
                  <th className="border border-blue-500 px-3 py-3">Delivery Cost</th>
                  <th className="border border-blue-500 px-3 py-3">Sale Qty</th>
                  <th className="border border-blue-500 px-3 py-3">Sale Price</th>
                  <th className="border border-blue-500 px-3 py-3">Lot Cost</th>
                  <th className="border border-blue-500 px-3 py-3">Lot Sale</th>
                  <th className="border border-blue-500 px-3 py-3">Lot Profit</th>
                  <th className="border border-blue-500 px-3 py-3">Per Sale Profit</th>
                  <th className="border border-blue-500 px-3 py-3">Action</th>

                </tr>
              </thead>

              <tbody>

                {rows.map((row, index) => {

                  const result =
                    results[index];

                  return (
                    <tr
                      key={index}
                      className="hover:bg-slate-50"
                    >

                      <td className="border border-slate-200 bg-slate-50 px-3 py-2 text-center font-semibold">
                        {index + 1}
                      </td>

                      <td className="border border-slate-200 px-2 py-2">
                        <input
                          type="date"
                          value={row.date}
                          onChange={(e) =>
                            updateRow(
                              index,
                              "date",
                              e.target.value
                            )
                          }
                          className="w-full rounded-md border border-slate-300 px-2 py-2"
                        />
                      </td>

                      <td className="border border-slate-200 px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          value={row.purchaseQty}
                          onChange={(e) =>
                            updateRow(
                              index,
                              "purchaseQty",
                              e.target.value
                            )
                          }
                          className="w-full rounded-md border border-slate-300 px-2 py-2 text-right"
                        />
                      </td>

                      <td className="border border-slate-200 px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={row.unitCost}
                          onChange={(e) =>
                            updateRow(
                              index,
                              "unitCost",
                              e.target.value
                            )
                          }
                          className="w-full rounded-md border border-slate-300 px-2 py-2 text-right"
                        />
                      </td>

                      <td className="border border-slate-200 px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={row.deliveryCost}
                          onChange={(e) =>
                            updateRow(
                              index,
                              "deliveryCost",
                              e.target.value
                            )
                          }
                          className="w-full rounded-md border border-slate-300 px-2 py-2 text-right"
                        />
                      </td>

                      <td className="border border-slate-200 px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          value={row.saleQty}
                          onChange={(e) =>
                            updateRow(
                              index,
                              "saleQty",
                              e.target.value
                            )
                          }
                          className="w-full rounded-md border border-slate-300 px-2 py-2 text-right"
                        />
                      </td>

                      <td className="border border-slate-200 px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={row.salePrice}
                          onChange={(e) =>
                            updateRow(
                              index,
                              "salePrice",
                              e.target.value
                            )
                          }
                          className="w-full rounded-md border border-slate-300 px-2 py-2 text-right"
                        />
                      </td>

                      <td className="border border-slate-200 bg-slate-50 px-3 py-2 text-right font-semibold">
                        {result
                          ? formatNumber(result.lotCost)
                          : "-"}
                      </td>

                      <td className="border border-slate-200 bg-slate-50 px-3 py-2 text-right font-semibold">
                        {result
                          ? formatNumber(result.lotSale)
                          : "-"}
                      </td>

                      <td
                        className={`border border-slate-200 px-3 py-2 text-right font-bold ${
                          result?.lotProfit >= 0
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {result
                          ? formatNumber(result.lotProfit)
                          : "-"}
                      </td>

                      <td
                        className={`border border-slate-200 px-3 py-2 text-right font-bold ${
                          result?.perSaleProfit >= 0
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {result
                          ? formatNumber(result.perSaleProfit)
                          : "-"}
                      </td>

                      <td className="border border-slate-200 px-2 py-2 text-center">

                        <button
                          type="button"
                          onClick={() =>
                            removeRow(index)
                          }
                          className="rounded-md bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                        >
                          🗑 Remove
                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

              {calculated && results.length > 0 && (
                <tfoot>

                  <tr className="bg-slate-800 font-bold text-white">

                    <td
                      colSpan="7"
                      className="border border-slate-700 px-3 py-3 text-right"
                    >
                      TOTAL
                    </td>

                    <td className="border border-slate-700 px-3 py-3 text-right">
                      {formatNumber(totalCost)}
                    </td>

                    <td className="border border-slate-700 px-3 py-3 text-right">
                      {formatNumber(totalSale)}
                    </td>

                    <td
                      className={`border border-slate-700 px-3 py-3 text-right ${
                        totalProfit >= 0
                          ? "text-green-300"
                          : "text-red-300"
                      }`}
                    >
                      {formatNumber(totalProfit)}
                    </td>

                    <td
                      className={`border border-slate-700 px-3 py-3 text-right ${
                        overallPerSaleProfit >= 0
                          ? "text-green-300"
                          : "text-red-300"
                      }`}
                    >
                      {formatNumber(overallPerSaleProfit)}
                    </td>

                    <td className="border border-slate-700"></td>

                  </tr>

                </tfoot>
              )}

            </table>

          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:px-6">

            <button
              type="button"
              onClick={calculateProfit}
              className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              💰 Calculate Total Profit
            </button>

            <button
              type="button"
              onClick={exportCSV}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              📤 Export CSV
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="rounded-lg bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600"
            >
              🗑 Clear All
            </button>

          </div>

        </div>

        {calculated && results.length > 0 && (

          <>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Total Cost
                </p>
                <p className="mt-2 text-2xl font-bold text-blue-600">
                  {formatNumber(totalCost)}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Total Sale
                </p>
                <p className="mt-2 text-2xl font-bold text-purple-600">
                  {formatNumber(totalSale)}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Overall Profit
                </p>
                <p
                  className={`mt-2 text-2xl font-bold ${
                    totalProfit >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatNumber(totalProfit)}
                </p>
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Overall Per Sale Profit
                </p>
                <p
                  className={`mt-2 text-2xl font-bold ${
                    overallPerSaleProfit >= 0
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {formatNumber(overallPerSaleProfit)}
                </p>
              </div>

            </div>

            <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">

              <h3 className="mb-4 text-lg font-bold text-slate-800">
                Calculation Details
              </h3>

              <div className="space-y-2">

                {results.map((row, index) => (

                  <div
                    key={index}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"
                  >

                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                      <span className="font-semibold text-slate-700">
                        Row {index + 1} [
                        {row.date || "N/A"}
                        ]
                      </span>

                      <span className="text-slate-600">

                        Cost:{" "}
                        <b>
                          {formatNumber(row.lotCost)}
                        </b>

                        {" | "}

                        Sale:{" "}
                        <b>
                          {formatNumber(row.lotSale)}
                        </b>

                        {" | "}

                        Profit:{" "}
                        <b
                          className={
                            row.lotProfit >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {formatNumber(row.lotProfit)}
                        </b>

                        {" | "}

                        Per Sale:{" "}
                        <b
                          className={
                            row.perSaleProfit >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {formatNumber(row.perSaleProfit)}
                        </b>

                      </span>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </>

        )}

      </div>
    </div>
  );
}
