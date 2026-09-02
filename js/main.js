/* =================================================
   OGP PRINT - MAIN FUNCTIONALITY
================================================= */


/* =================================================
   SESSION
================================================= */

let currentSession =
    "6848999126945";


const SESSION_HOME_URL =
    "https://reportsrv.dbl-group.com:8090/ords/r/bpm/accessories/home";


/* =================================================
   COUNTDOWN
================================================= */

let countdownTimer = null;

let remainingSeconds = 300;

let expiredSeconds = 0;

let isExpired = false;

let expiredLinkOpened = false;


/* =================================================
   TYPING
================================================= */

let typingTimer = null;

let typingIndex = 0;

let typingDirection = "typing";

let typingPauseCounter = 0;


const creatorText =
    "- Create by Sabbir";


const typingSpeed = 90;

const fullTextPause = 20;

const emptyTextPause = 5;


/* =================================================
   EYES
================================================= */

const eyesContainer =
    document.getElementById(
        "eyesContainer"
    );


const eyes =
    document.querySelectorAll(
        ".eye"
    );


const pupils =
    document.querySelectorAll(
        ".pupil"
    );


function moveEyes(
    clientX,
    clientY
) {

    eyes.forEach(
        function (
            eye,
            index
        ) {

            const rect =
                eye.getBoundingClientRect();


            const centerX =
                rect.left +
                rect.width / 2;


            const centerY =
                rect.top +
                rect.height / 2;


            const deltaX =
                clientX -
                centerX;


            const deltaY =
                clientY -
                centerY;


            const angle =
                Math.atan2(
                    deltaY,
                    deltaX
                );


            const maxMove = 12;


            const distance =
                Math.min(
                    maxMove,
                    Math.sqrt(
                        deltaX * deltaX +
                        deltaY * deltaY
                    ) / 8
                );


            const moveX =
                Math.cos(angle) *
                distance;


            const moveY =
                Math.sin(angle) *
                distance;


            pupils[index].style.transform =
                `translate(
                    calc(-50% + ${moveX}px),
                    calc(-50% + ${moveY}px)
                )`;

        }
    );

}


document.addEventListener(
    "mousemove",
    function (event) {

        moveEyes(
            event.clientX,
            event.clientY
        );

    },
    {
        passive: true
    }
);


document.addEventListener(
    "touchmove",
    function (event) {

        if (
            event.touches &&
            event.touches.length
        ) {

            moveEyes(
                event.touches[0].clientX,
                event.touches[0].clientY
            );

        }

    },
    {
        passive: true
    }
);


/* =================================================
   EYES STATE
================================================= */

function resetEyes() {

    eyesContainer.classList.remove(
        "expired"
    );

}


function makeEyesRed() {

    eyesContainer.classList.add(
        "expired"
    );

}


/* =================================================
   OPEN SESSION HOME
================================================= */

function openSessionHome() {

    if (
        expiredLinkOpened
    ) {

        return;

    }


    expiredLinkOpened =
        true;


    window.open(
        SESSION_HOME_URL,
        "_blank"
    );

}


/* =================================================
   OGP CHANGE
================================================= */

function changeOGP(step) {

    const input =
        document.getElementById(
            "ogpInput"
        );


    let value =
        input.value.trim();


    if (
        value === ""
    ) {

        if (
            step > 0
        ) {

            input.value =
                "2";


            generateLinks();

        }


        input.focus();

        return;

    }


    if (
        !/^\d+$/.test(value)
    ) {

        return;

    }


    let number =
        parseInt(
            value,
            10
        );


    number +=
        step;


    if (
        number < 0
    ) {

        number = 0;

    }


    input.value =
        number;


    generateLinks();


    input.focus();

}


/* =================================================
   GENERATE LINKS
================================================= */

function generateLinks() {

    const input =
        document.getElementById(
            "ogpInput"
        );


    const value =
        input.value.trim();


    const links =
        document.getElementById(
            "links"
        );


    const clearBtn =
        document.getElementById(
            "ogpClearBtn"
        );


    clearBtn.style.display =
        value !== ""
            ? "block"
            : "none";


    if (
        value === ""
    ) {

        links.innerHTML =
            "";

        return;

    }


    const encodedOGP =
        encodeURIComponent(
            value
        );


    const gatePassUrl =
        "https://reportsrv.dbl-group.com:8090/ords/f?p=507:0:" +
        currentSession +
        ":PRINT_REPORT=DeliveryGatePass:::P2_OGPNUMBER:OGP-" +
        encodedOGP;


    const gatePassUrl2 =
        "https://reportsrv.dbl-group.com:8090/ords/f?p=507:0:" +
        currentSession +
        ":PRINT_REPORT=OtherGatePass:::P22_OGPNUMBER:OGP-" +
        encodedOGP;


    const challanUrl =
        "https://reportsrv.dbl-group.com:8090/ords/f?p=507:0:" +
        currentSession +
        ":PRINT_REPORT=DeliveryChallan:::P2_OGPNUMBER:OGP-" +
        encodedOGP;


    links.innerHTML = `

        <a
            href="${challanUrl}"
            target="_blank"
            class="
                mb-2.5
                block
                rounded-[5px]
                bg-[#007bff]
                p-3
                text-center
                text-white
                no-underline
                transition
                hover:bg-[#0056b3]
            "
        >
            Delivery Challan
        </a>


        <a
            href="${gatePassUrl}"
            target="_blank"
            class="
                mb-2.5
                block
                rounded-[5px]
                bg-[#007bff]
                p-3
                text-center
                text-white
                no-underline
                transition
                hover:bg-[#0056b3]
            "
        >
            Delivery Gate Pass
        </a>


        <a
            href="${gatePassUrl2}"
            target="_blank"
            class="
                mb-2.5
                block
                rounded-[5px]
                bg-[#007bff]
                p-3
                text-center
                text-white
                no-underline
                transition
                hover:bg-[#0056b3]
            "
        >
            Generic Gate Pass
        </a>

    `;

}


/* =================================================
   SESSION LINK
================================================= */

function handleSessionLink() {

    const input =
        document.getElementById(
            "sessionInput"
        );


    const value =
        input.value.trim();


    const clearBtn =
        document.getElementById(
            "sessionClearBtn"
        );


    const wrapper =
        document.getElementById(
            "sessionInfoWrapper"
        );


    if (
        value !== ""
    ) {

        clearBtn.style.display =
            "block";


        startTypingAnimation();

    }

    else {

        clearBtn.style.display =
            "none";


        stopTypingAnimation();

    }


    if (
        value === ""
    ) {

        wrapper.style.display =
            "none";


        stopCountdown();

        resetEyes();

        return;

    }


    try {

        const url =
            new URL(value);


        const session =
            url.searchParams.get(
                "session"
            );


        if (
            !session ||
            !/^\d+$/.test(session)
        ) {

            showInvalidSession();

            return;

        }


        currentSession =
            session;


        resetEyes();


        const sessionId =
            document.getElementById(
                "sessionId"
            );


        sessionId.textContent =
            currentSession;


        sessionId.classList.remove(
            "text-red-600"
        );


        wrapper.style.display =
            "block";


        document.getElementById(
            "sessionArea"
        ).style.display =
            "none";


        document.getElementById(
            "sessionSuccess"
        ).style.display =
            "block";


        startTypingAnimation();

        generateLinks();

        startCountdown();

    }

    catch (error) {

        showInvalidSession();

    }

}


/* =================================================
   INVALID SESSION
================================================= */

function showInvalidSession() {

    const wrapper =
        document.getElementById(
            "sessionInfoWrapper"
        );


    const sessionId =
        document.getElementById(
            "sessionId"
        );


    const countdown =
        document.getElementById(
            "countdown"
        );


    wrapper.style.display =
        "block";


    sessionId.textContent =
        "Invalid Link";


    sessionId.classList.add(
        "text-red-600"
    );


    countdown.textContent =
        "--";


    countdown.classList.add(
        "text-red-600"
    );


    stopCountdown();

}


/* =================================================
   BORDER
================================================= */

function updateBorderProgress() {

    const wrapper =
        document.getElementById(
            "sessionInfoWrapper"
        );


    const elapsed =
        300 -
        remainingSeconds;


    let progress =
        (elapsed / 300) *
        100;


    progress =
        Math.max(
            0,
            Math.min(
                100,
                progress
            )
        );


    wrapper.style.setProperty(
        "--progress",
        progress
    );

}


/* =================================================
   COUNTDOWN START
================================================= */

function startCountdown() {

    stopCountdown();


    remainingSeconds =
        300;


    expiredSeconds =
        0;


    isExpired =
        false;


    expiredLinkOpened =
        false;


    resetEyes();


    const countdown =
        document.getElementById(
            "countdown"
        );


    const wrapper =
        document.getElementById(
            "sessionInfoWrapper"
        );


    wrapper.style.setProperty(
        "--progress",
        0
    );


    wrapper.classList.remove(
        "expired-border"
    );


    countdown.classList.remove(
        "text-red-600"
    );


    countdown.classList.add(
        "text-[#007bff]"
    );


    countdown.textContent =
        remainingSeconds;


    countdownTimer =
        setInterval(
            function () {

                if (
                    !isExpired
                ) {

                    remainingSeconds--;


                    countdown.textContent =
                        remainingSeconds;


                    updateBorderProgress();


                    if (
                        remainingSeconds <= 0
                    ) {

                        isExpired =
                            true;


                        expiredSeconds =
                            0;


                        makeEyesRed();


                        wrapper.style.setProperty(
                            "--progress",
                            100
                        );


                        wrapper.classList.add(
                            "expired-border"
                        );


                        countdown.textContent =
                            "Expired +0s";


                        countdown.classList.remove(
                            "text-[#007bff]"
                        );


                        countdown.classList.add(
                            "text-red-600"
                        );


                        document.getElementById(
                            "sessionArea"
                        ).style.display =
                            "block";


                        document.getElementById(
                            "sessionSuccess"
                        ).style.display =
                            "block";


                        document.getElementById(
                            "sessionClearBtn"
                        ).style.display =
                            "block";


                        startTypingAnimation();


                        openSessionHome();

                    }

                }

                else {

                    expiredSeconds++;


                    countdown.textContent =
                        "Expired +" +
                        expiredSeconds +
                        "s";


                    makeEyesRed();

                }

            },
            1000
        );

}


/* =================================================
   COUNTDOWN STOP
================================================= */

function stopCountdown() {

    if (
        countdownTimer !== null
    ) {

        clearInterval(
            countdownTimer
        );


        countdownTimer =
            null;

    }

}


/* =================================================
   TYPING
================================================= */

function startTypingAnimation() {

    const creator =
        document.getElementById(
            "creator"
        );


    if (
        typingTimer !== null
    ) {

        return;

    }


    creator.style.display =
        "block";


    typingIndex = 0;

    typingDirection = "typing";

    typingPauseCounter = 0;

    creator.textContent = "";


    typingTimer =
        setInterval(
            function () {

                if (
                    typingDirection ===
                    "typing"
                ) {

                    typingIndex++;


                    creator.textContent =
                        creatorText.substring(
                            0,
                            typingIndex
                        );


                    if (
                        typingIndex >=
                        creatorText.length
                    ) {

                        typingDirection =
                            "full-pause";


                        typingPauseCounter =
                            0;

                    }

                }


                else if (
                    typingDirection ===
                    "full-pause"
                ) {

                    typingPauseCounter++;


                    if (
                        typingPauseCounter >=
                        fullTextPause
                    ) {

                        typingDirection =
                            "deleting";


                        typingPauseCounter =
                            0;

                    }

                }


                else if (
                    typingDirection ===
                    "deleting"
                ) {

                    typingIndex--;


                    creator.textContent =
                        creatorText.substring(
                            0,
                            typingIndex
                        );


                    if (
                        typingIndex <= 0
                    ) {

                        typingDirection =
                            "empty-pause";


                        typingPauseCounter =
                            0;

                    }

                }


                else {

                    typingPauseCounter++;


                    if (
                        typingPauseCounter >=
                        emptyTextPause
                    ) {

                        typingDirection =
                            "typing";


                        typingPauseCounter =
                            0;

                    }

                }

            },
            typingSpeed
        );

}


/* =================================================
   TYPING STOP
================================================= */

function stopTypingAnimation() {

    const creator =
        document.getElementById(
            "creator"
        );


    if (
        typingTimer !== null
    ) {

        clearInterval(
            typingTimer
        );


        typingTimer =
            null;

    }


    creator.textContent =
        "";


    creator.style.display =
        "none";


    typingIndex = 0;

    typingDirection = "typing";

    typingPauseCounter = 0;

}


/* =================================================
   CLEAR OGP
================================================= */

function clearOGP() {

    const input =
        document.getElementById(
            "ogpInput"
        );


    input.value =
        "";


    document.getElementById(
        "links"
    ).innerHTML =
        "";


    document.getElementById(
        "ogpClearBtn"
    ).style.display =
        "none";


    input.focus();

}


/* =================================================
   CLEAR SESSION
================================================= */

function clearSessionLink() {

    document.getElementById(
        "sessionInput"
    ).value =
        "";


    document.getElementById(
        "sessionArea"
    ).style.display =
        "block";


    document.getElementById(
        "sessionSuccess"
    ).style.display =
        "none";


    document.getElementById(
        "sessionClearBtn"
    ).style.display =
        "none";


    const wrapper =
        document.getElementById(
            "sessionInfoWrapper"
        );


    wrapper.style.display =
        "none";


    wrapper.style.setProperty(
        "--progress",
        0
    );


    wrapper.classList.remove(
        "expired-border"
    );


    resetEyes();

    stopTypingAnimation();

    stopCountdown();


    currentSession =
        "6848999126945";


    expiredLinkOpened =
        false;


    generateLinks();


    document.getElementById(
        "sessionInput"
    ).focus();

}


/* =================================================
   CTRL + SHIFT + S
================================================= */

function showSessionInput() {

    const sessionArea =
        document.getElementById(
            "sessionArea"
        );


    const sessionInput =
        document.getElementById(
            "sessionInput"
        );


    sessionArea.style.display =
        "block";


    document.getElementById(
        "sessionSuccess"
    ).style.display =
        "none";


    sessionInput.focus();

    sessionInput.select();

}


document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.ctrlKey &&
            event.shiftKey &&
            event.key.toLowerCase() === "s"
        ) {

            event.preventDefault();


            const loginScreen =
                document.getElementById(
                    "loginScreen"
                );


            if (
                loginScreen &&
                loginScreen.style.display !== "none"
            ) {

                return;

            }


            window.open(
                SESSION_HOME_URL,
                "_blank"
            );


            showSessionInput();

        }

    }
);


/* =================================================
   OGP KEYBOARD
================================================= */

document.getElementById(
    "ogpInput"
).addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "ArrowUp"
        ) {

            event.preventDefault();

            changeOGP(2);

        }


        if (
            event.key === "ArrowDown"
        ) {

            event.preventDefault();

            changeOGP(-2);

        }

    }
);


/* =================================================
   EVENTS
================================================= */

document.getElementById(
    "ogpInput"
).addEventListener(
    "input",
    generateLinks
);


document.getElementById(
    "sessionInput"
).addEventListener(
    "input",
    handleSessionLink
);


document.getElementById(
    "ogpPlusBtn"
).addEventListener(
    "click",
    function () {

        changeOGP(2);

    }
);


document.getElementById(
    "ogpMinusBtn"
).addEventListener(
    "click",
    function () {

        changeOGP(-2);

    }
);


document.getElementById(
    "ogpClearBtn"
).addEventListener(
    "click",
    clearOGP
);


document.getElementById(
    "sessionClearBtn"
).addEventListener(
    "click",
    clearSessionLink
);


/* =================================================
   INITIAL
================================================= */

generateLinks();