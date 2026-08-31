import { useEffect, useRef, useState } from "react";

const LOGIN_PASSWORD = "1234";

const DEFAULT_SESSION = "6848999126945";

const SESSION_HOME_URL =
  "https://reportsrv.dbl-group.com:8090/ords/r/bpm/accessories/home";

const CREATOR_TEXT = "- Create by Sabbir";

export default function OGPPrint() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [sessionInput, setSessionInput] = useState("");
  const [currentSession, setCurrentSession] = useState(DEFAULT_SESSION);

  const [sessionValid, setSessionValid] = useState(false);
  const [sessionError, setSessionError] = useState(false);

  const [ogpNumber, setOgpNumber] = useState("");

  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [expiredSeconds, setExpiredSeconds] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  const [creatorText, setCreatorText] = useState("");

  const [headerDateTime, setHeaderDateTime] = useState(
    formatDateTime(new Date())
  );

  const passwordRef = useRef(null);
  const sessionRef = useRef(null);
  const ogpRef = useRef(null);

  const countdownRef = useRef(null);
  const typingRef = useRef(null);

  const expiredLinkOpenedRef = useRef(false);

  /* =================================================
     HEADER DATE/TIME
  ================================================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setHeaderDateTime(formatDateTime(new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* =================================================
     PASSWORD FOCUS
  ================================================= */

  useEffect(() => {
    passwordRef.current?.focus();
  }, []);

  /* =================================================
     KEYBOARD SHORTCUTS
  ================================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      /* Ctrl + Shift + L */
      if (
        event.ctrlKey &&
        event.shiftKey &&
        event.key.toLowerCase() === "l"
      ) {
        event.preventDefault();

        if (isLoggedIn) {
          lockPage();
        }

        return;
      }

      /* Ctrl + Shift + S */
      if (
        event.ctrlKey &&
        event.shiftKey &&
        event.key.toLowerCase() === "s"
      ) {
        event.preventDefault();

        if (!isLoggedIn) return;

        window.open(SESSION_HOME_URL, "_blank");

        setTimeout(() => {
          sessionRef.current?.focus();
          sessionRef.current?.select();
        }, 50);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLoggedIn]);

  /* =================================================
     CLEANUP
  ================================================= */

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }

      if (typingRef.current) {
        clearInterval(typingRef.current);
      }
    };
  }, []);

  /* =================================================
     LOGIN
  ================================================= */

  const login = () => {
    if (password === LOGIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError(false);
      setPassword("");

      setTimeout(() => {
        if (ogpNumber.trim() !== "") {
          ogpRef.current?.focus();
        } else if (sessionInput.trim() === "") {
          sessionRef.current?.focus();
        }
      }, 100);
    } else {
      setLoginError(true);
      setPassword("");

      setTimeout(() => {
        passwordRef.current?.focus();
      }, 50);
    }
  };

  /* =================================================
     LOCK
  ================================================= */

  const lockPage = () => {
    setIsLoggedIn(false);
    setLoginError(false);
    setPassword("");

    stopCountdown();
    stopTypingAnimation();
  };

  /* =================================================
     SESSION TYPING ANIMATION
  ================================================= */

  const startTypingAnimation = () => {
    if (typingRef.current) return;

    let index = 0;
    let direction = "typing";
    let pauseCounter = 0;

    setCreatorText("");

    typingRef.current = setInterval(() => {
      if (direction === "typing") {
        index++;

        setCreatorText(CREATOR_TEXT.substring(0, index));

        if (index >= CREATOR_TEXT.length) {
          direction = "full-pause";
          pauseCounter = 0;
        }
      } else if (direction === "full-pause") {
        pauseCounter++;

        if (pauseCounter >= 20) {
          direction = "deleting";
          pauseCounter = 0;
        }
      } else if (direction === "deleting") {
        index--;

        setCreatorText(CREATOR_TEXT.substring(0, index));

        if (index <= 0) {
          direction = "empty-pause";
          pauseCounter = 0;
        }
      } else if (direction === "empty-pause") {
        pauseCounter++;

        if (pauseCounter >= 5) {
          direction = "typing";
          pauseCounter = 0;
        }
      }
    }, 90);
  };

  const stopTypingAnimation = () => {
    if (typingRef.current) {
      clearInterval(typingRef.current);
      typingRef.current = null;
    }

    setCreatorText("");
  };

  /* =================================================
     COUNTDOWN
  ================================================= */

  const startCountdown = () => {
    stopCountdown();

    setRemainingSeconds(300);
    setExpiredSeconds(0);
    setIsExpired(false);

    expiredLinkOpenedRef.current = false;

    countdownRef.current = setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
          setIsExpired(true);
          setExpiredSeconds(0);

          openSessionHome();

          return 0;
        }

        return previous - 1;
      });

      setExpiredSeconds((previous) => {
        return previous;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!isExpired) return;

    const timer = setInterval(() => {
      setExpiredSeconds((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isExpired]);

  const stopCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    setIsExpired(false);
  };

  /* =================================================
     OPEN SESSION HOME
  ================================================= */

  const openSessionHome = () => {
    if (expiredLinkOpenedRef.current) return;

    expiredLinkOpenedRef.current = true;

    window.open(SESSION_HOME_URL, "_blank");
  };

  /* =================================================
     SESSION LINK
  ================================================= */

  const handleSessionLink = (value) => {
    setSessionInput(value);

    const trimmedValue = value.trim();

    if (trimmedValue === "") {
      setSessionValid(false);
      setSessionError(false);

      stopCountdown();
      stopTypingAnimation();

      setCurrentSession(DEFAULT_SESSION);

      return;
    }

    startTypingAnimation();

    try {
      const url = new URL(trimmedValue);

      const session = url.searchParams.get("session");

      if (!session || !/^\d+$/.test(session)) {
        setSessionValid(false);
        setSessionError(true);
        stopCountdown();
        return;
      }

      setCurrentSession(session);
      setSessionValid(true);
      setSessionError(false);

      startCountdown();
    } catch {
      setSessionValid(false);
      setSessionError(true);

      stopCountdown();
    }
  };

  /* =================================================
     CLEAR SESSION
  ================================================= */

  const clearSession = () => {
    setSessionInput("");
    setSessionValid(false);
    setSessionError(false);

    setCurrentSession(DEFAULT_SESSION);

    setRemainingSeconds(300);
    setExpiredSeconds(0);
    setIsExpired(false);

    expiredLinkOpenedRef.current = false;

    stopCountdown();
    stopTypingAnimation();

    setTimeout(() => {
      sessionRef.current?.focus();
    }, 50);
  };

  /* =================================================
     OGP CHANGE
  ================================================= */

  const changeOGP = (step) => {
    const value = ogpNumber.trim();

    if (value === "") {
      if (step > 0) {
        setOgpNumber("2");
      }

      ogpRef.current?.focus();

      return;
    }

    if (!/^\d+$/.test(value)) {
      return;
    }

    let number = parseInt(value, 10);

    number += step;

    if (number < 0) {
      number = 0;
    }

    setOgpNumber(String(number));

    ogpRef.current?.focus();
  };

  /* =================================================
     CLEAR OGP
  ================================================= */

  const clearOGP = () => {
    setOgpNumber("");

    setTimeout(() => {
      ogpRef.current?.focus();
    }, 50);
  };

  /* =================================================
     OGP LINKS
  ================================================= */

  const getLinks = () => {
    const value = ogpNumber.trim();

    if (!value) return null;

    const gatePassUrl =
      "https://reportsrv.dbl-group.com:8090/ords/f?p=507:0:" +
      currentSession +
      ":PRINT_REPORT=DeliveryGatePass:::P2_OGPNUMBER:OGP-" +
      encodeURIComponent(value);

    const gatePassUrl2 =
      "https://reportsrv.dbl-group.com:8090/ords/f?p=507:0:" +
      currentSession +
      ":PRINT_REPORT=OtherGatePass:::P22_OGPNUMBER:OGP-" +
      encodeURIComponent(value);

    const challanUrl =
      "https://reportsrv.dbl-group.com:8090/ords/f?p=507:0:" +
      currentSession +
      ":PRINT_REPORT=DeliveryChallan:::P2_OGPNUMBER:OGP-" +
      encodeURIComponent(value);

    return {
      gatePassUrl,
      gatePassUrl2,
      challanUrl,
    };
  };

  const links = getLinks();

  /* =================================================
     EYES
  ================================================= */

  const handleMouseMove = (event) => {
    const pupils = document.querySelectorAll(".ogp-pupil");

    pupils.forEach((pupil) => {
      const eye = pupil.parentElement;
      const rect = eye.getBoundingClientRect();

      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = event.clientX - eyeCenterX;
      const deltaY = event.clientY - eyeCenterY;

      const angle = Math.atan2(deltaY, deltaX);

      const maxMove = 12;

      const distance = Math.min(
        maxMove,
        Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 8
      );

      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      pupil.style.transform = `
        translate(
          calc(-50% + ${moveX}px),
          calc(-50% + ${moveY}px)
        )
      `;
    });
  };

  /* =================================================
     LOGIN SCREEN
  ================================================= */

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-gradient-to-br from-[#f5f7fa] to-[#e8edf3]">
          <div className="w-full max-w-[360px] rounded-[14px] bg-white p-[30px] text-center shadow-[0_10px_35px_rgba(0,0,0,0.15)] max-[600px]:m-5 max-[600px]:p-[25px]">
            <div className="mb-2.5 text-[45px]">🔐</div>

            <h2 className="mb-2 text-2xl font-bold">
              OGP Print
            </h2>

            <div className="mb-[22px] text-[13px] text-[#777]">
              Enter password to continue
            </div>

            <input
              ref={passwordRef}
              type="password"
              value={password}
              placeholder="Enter password"
              autoComplete="off"
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  login();
                }
              }}
              className="mb-3 w-full rounded-md border border-[#ccc] p-3 text-base outline-none transition focus:border-[#007bff]"
            />

            <button
              type="button"
              onClick={login}
              className="w-full rounded-md border-0 bg-[#007bff] p-3 text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-[#0056b3]"
            >
              Login
            </button>

            {loginError && (
              <div className="mt-3 text-[13px] text-red-600">
                Wrong password. Please try again.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* =================================================
     MAIN PAGE
  ================================================= */

  const progress = isExpired
    ? 100
    : ((300 - remainingSeconds) / 300) * 100;

  return (
    <div
      className="min-h-screen bg-[#f5f5f5] p-10 max-[600px]:p-5"
      onMouseMove={handleMouseMove}
    >
      {/* LOCK BUTTON */}

      <div className="mx-auto mb-2.5 flex max-w-[500px] justify-end">
        <button
          type="button"
          onClick={lockPage}
          className="rounded-md border-0 bg-[#dc3545] px-[13px] py-[7px] text-[13px] font-bold text-white transition hover:-translate-y-px hover:bg-[#c82333]"
        >
          🔒 Lock
        </button>
      </div>

      {/* MAIN CONTAINER */}

      <div className="mx-auto max-w-[500px] rounded-[10px] bg-white p-[25px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
        {/* EYES */}

        <div className="mb-3 flex h-[70px] items-center justify-center gap-[18px]">
          {[1, 2].map((eye) => (
            <div
              key={eye}
              className="relative h-[58px] w-[58px] overflow-hidden rounded-full border-[3px] border-[#333] bg-white shadow-[0_2px_5px_rgba(0,0,0,0.15)]"
            >
              <div className="ogp-pupil absolute left-1/2 top-1/2 h-[25px] w-[25px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111] transition-transform duration-[40ms] ease-linear" />

              <div className="pointer-events-none absolute left-3 top-[11px] z-[3] h-3 w-3 rounded-full bg-white" />
            </div>
          ))}
        </div>

        {/* TITLE */}

        <h2 className="mb-5 mt-0 text-center text-2xl font-bold">
          OGP Print
        </h2>

        {/* SESSION AREA */}

        {!sessionValid && (
          <div>
            <div className="mb-[7px] flex items-center justify-between">
              <div className="text-sm font-bold">
                Paste Report Link
              </div>

              <a
                href={SESSION_HOME_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-[5px] bg-[#28a745] px-[14px] py-1.5 text-center text-[13px] font-bold text-white no-underline transition hover:-translate-y-px hover:bg-[#218838]"
              >
                Session↗️
              </a>
            </div>

            <div className="relative mb-[15px] w-full">
              <input
                ref={sessionRef}
                type="text"
                value={sessionInput}
                placeholder="Paste report link here"
                onChange={(e) =>
                  handleSessionLink(e.target.value)
                }
                className="w-full rounded-[5px] border border-[#ccc] p-3 pr-[42px] text-base outline-none transition focus:border-[#007bff]"
              />

              {sessionInput && (
                <button
                  type="button"
                  onClick={clearSession}
                  className="absolute right-2.5 top-2 z-[5] h-[27px] w-[27px] rounded-full border-0 bg-[#999] p-0 text-xl leading-[25px] text-white transition hover:scale-[1.08] hover:bg-[#555]"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}

        {/* SESSION ERROR */}

        {sessionError && (
          <div className="mb-[15px] rounded-lg border-[3px] border-red-500 bg-[#fff5f5] p-2.5 text-sm leading-6">
            <div>
              <strong>Session ID:</strong>{" "}
              <span className="break-all text-red-600">
                Invalid Link
              </span>
            </div>

            <div>
              <strong>Session Time:</strong>{" "}
              <span className="font-bold text-red-600">
                --
              </span>
            </div>
          </div>
        )}

        {/* SESSION SUCCESS */}

        {sessionValid && (
          <>
            <div className="mb-2.5 text-2xl font-bold text-[#28a745]">
              Session ✓
            </div>

            {/* CREATOR */}

            <div className="creator mb-2.5 min-h-4 overflow-hidden whitespace-nowrap text-[13px] italic text-[#666]">
              {creatorText}
            </div>

            {/* SESSION INFO */}

            <div
              className={`relative mb-[15px] overflow-hidden rounded-lg p-[3px] ${
                isExpired
                  ? "border-[3px] border-red-500"
                  : ""
              }`}
              style={
                !isExpired
                  ? {
                      background: `conic-gradient(
                        #007bff ${progress}%,
                        #d6ebff 0
                      )`,
                    }
                  : undefined
              }
            >
              <div className="relative z-[1] rounded-[5px] bg-[#f1f8ff] p-2.5 text-sm leading-6">
                <div>
                  <strong>Session ID:</strong>{" "}
                  <span className="break-all text-[#333]">
                    {currentSession}
                  </span>
                </div>

                <div>
                  <strong>Session Time:</strong>{" "}
                  <span
                    className={`text-base font-bold ${
                      isExpired
                        ? "text-red-600"
                        : "text-[#007bff]"
                    }`}
                  >
                    {isExpired
                      ? `Expired +${expiredSeconds}s`
                      : remainingSeconds}
                  </span>

                  {!isExpired && " seconds"}
                </div>
              </div>
            </div>

            {/* CLEAR SESSION */}

            <div className="mb-[15px]">
              <button
                type="button"
                onClick={clearSession}
                className="rounded-md bg-[#dc3545] px-3 py-2 text-[13px] font-bold text-white transition hover:bg-[#c82333]"
              >
                Clear Session
              </button>
            </div>
          </>
        )}

        {/* OGP NUMBER */}

        <div className="mb-[7px] text-sm font-bold">
          OGP Number
        </div>

        <div className="relative mb-[15px] w-full">
          <div className="flex w-full items-center gap-1.5">
            <button
              type="button"
              onClick={() => changeOGP(-2)}
              title="Decrease by 2"
              className="h-[42px] w-[42px] flex-none rounded-md border-0 bg-[#007bff] p-0 text-2xl font-bold leading-[42px] text-white transition hover:-translate-y-px hover:bg-[#0056b3] active:scale-95"
            >
              −
            </button>

            <input
              ref={ogpRef}
              type="text"
              value={ogpNumber}
              placeholder="Enter OGP Number"
              onChange={(e) => setOgpNumber(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  changeOGP(2);
                }

                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  changeOGP(-2);
                }
              }}
              className="min-w-0 flex-1 rounded-[5px] border border-[#ccc] p-3 pr-[42px] text-base outline-none transition focus:border-[#007bff]"
            />

            <button
              type="button"
              onClick={() => changeOGP(2)}
              title="Increase by 2"
              className="h-[42px] w-[42px] flex-none rounded-md border-0 bg-[#007bff] p-0 text-2xl font-bold leading-[42px] text-white transition hover:-translate-y-px hover:bg-[#0056b3] active:scale-95"
            >
              +
            </button>
          </div>

          {ogpNumber && (
            <button
              type="button"
              onClick={clearOGP}
              className="absolute right-[58px] top-2 z-[5] h-[27px] w-[27px] rounded-full border-0 bg-[#999] p-0 text-xl leading-[25px] text-white transition hover:scale-[1.08] hover:bg-[#555]"
            >
              ×
            </button>
          )}
        </div>

        {/* GENERATED LINKS */}

        {links && (
          <div>
            <a
              href={links.challanUrl}
              target="_blank"
              rel="noreferrer"
              className="mb-2.5 block rounded-[5px] bg-[#007bff] p-3 text-center text-white no-underline transition hover:-translate-y-px hover:bg-[#0056b3]"
            >
              Delivery Challan
            </a>

            <a
              href={links.gatePassUrl}
              target="_blank"
              rel="noreferrer"
              className="mb-2.5 block rounded-[5px] bg-[#007bff] p-3 text-center text-white no-underline transition hover:-translate-y-px hover:bg-[#0056b3]"
            >
              Delivery Gate Pass
            </a>

            <a
              href={links.gatePassUrl2}
              target="_blank"
              rel="noreferrer"
              className="mb-2.5 block rounded-[5px] bg-[#007bff] p-3 text-center text-white no-underline transition hover:-translate-y-px hover:bg-[#0056b3]"
            >
              Generic Gate Pass
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* =================================================
   DATE FORMAT
================================================= */

function formatDateTime(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();

  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12;

  hours = String(hours).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}
