function updateHeaderDateTime() {

    const element =
        document.getElementById("headerDateTime");

    if (!element) return;

    const now = new Date();

    const day =
        String(now.getDate()).padStart(2, "0");

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const year =
        now.getFullYear();

    let hours =
        now.getHours();

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    const seconds =
        String(now.getSeconds()).padStart(2, "0");

    const ampm =
        hours >= 12 ? "pm" : "am";

    hours =
        hours % 12 || 12;

    hours =
        String(hours).padStart(2, "0");

    element.textContent =
        `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}

updateHeaderDateTime();

setInterval(
    updateHeaderDateTime,
    1000
);