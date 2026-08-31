function Layout() {

  const {
    Link,
    Outlet
  } = window.ReactRouterDOM;

  const [dateTime, setDateTime] = React.useState(
    new Date()
  );

  React.useEffect(() => {

    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  function formatDateTime(date) {

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const year = date.getFullYear();

    let hours = date.getHours();

    const minutes = String(
      date.getMinutes()
    ).padStart(2, "0");

    const seconds = String(
      date.getSeconds()
    ).padStart(2, "0");

    const ampm =
      hours >= 12
        ? "pm"
        : "am";

    hours =
      hours % 12 || 12;

    hours = String(
      hours
    ).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  }

  return (

    <div className="min-h-screen bg-[#f5f5f5]">

      <header className="relative z-10">

        <div
          className="
            flex
            min-h-[50px]
            items-center
            justify-between
            gap-3
            px-4
            text-white
            bg-gradient-to-r
            from-[#319a82]
            via-[#42a85c]
            to-[#82c83b]
          "
        >

          <div className="flex items-center gap-2 min-w-0">

            <div
              className="
                flex
                h-[30px]
                w-[30px]
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
                text-[11px]
                font-bold
                text-[#319a82]
                shadow-sm
              "
            >
              SG
            </div>

            <div className="truncate text-[18px] font-bold">
              Excel Editing - SH Group
            </div>

          </div>

          <div
            className="
              hidden
              shrink-0
              text-[14px]
              font-bold
              md:block
            "
          >
            {formatDateTime(dateTime)}
          </div>

          <Link
            to="/"
            className="shrink-0 text-[14px] font-bold text-white no-underline hover:underline"
          >
            → Back
          </Link>

        </div>

        <nav
          className="
            flex
            h-[42px]
            items-stretch
            overflow-x-auto
            border-b
            border-[#1d2124]
            bg-[#252a2d]
          "
        >

          <Link
            to="/excel-editing"
            className="
              flex
              shrink-0
              items-center
              border-r
              border-[#343a3d]
              px-5
              text-xs
              font-bold
              text-white
              no-underline
              transition
              hover:bg-[#343a3d]
            "
          >
            Excel Editing
          </Link>

          <Link
            to="/ogp-print"
            className="
              flex
              shrink-0
              items-center
              border-r
              border-[#343a3d]
              px-5
              text-xs
              font-bold
              text-white
              no-underline
              transition
              hover:bg-[#343a3d]
            "
          >
            OGP Print
          </Link>

          <Link
            to="/vehicle-summary"
            className="
              flex
              shrink-0
              items-center
              border-r
              border-[#343a3d]
              px-5
              text-xs
              font-bold
              text-white
              no-underline
              transition
              hover:bg-[#343a3d]
            "
          >
            Vehicle Summary
          </Link>

        </nav>

      </header>

      <main className="page-container">
        <Outlet />
      </main>

    </div>
  );
}
