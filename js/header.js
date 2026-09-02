function updateHeaderDateTime() {

    const element =
        document.getElementById("headerDateTime");

    if (!element) {
        return false;
    }

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

    return true;
}


function setActiveNav() {

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const links =
        document.querySelectorAll("#header a[href]");

    links.forEach(function (link) {

        const href =
            link.getAttribute("href");

        if (href === currentPage) {

            link.classList.add("active");

        } else {

            link.classList.remove("active");

        }

    });
}


function initializeHeader() {

    const header =
        document.getElementById("header");

    if (!header) {
        return;
    }

    // Header এখনো load না হলে আবার check করবে
    if (!document.getElementById("headerDateTime")) {
        setTimeout(initializeHeader, 100);
        return;
    }

    updateHeaderDateTime();

    setInterval(
        updateHeaderDateTime,
        1000
    );

    setActiveNav();
}


initializeHeader();