/* =========================================
   SH GROUP
   HOME CARDS
========================================= */

async function loadHomeCards() {

    const container =
        document.getElementById("homeCards");


    if (!container) {

        console.error(
            "homeCards container not found."
        );

        return;
    }


    try {

        const response =
            await fetch(
                "components/home/cards.json"
            );


        if (!response.ok) {

            throw new Error(
                `cards.json: ${response.status}`
            );

        }


        const cards =
            await response.json();


        container.innerHTML = "";


        cards.forEach(card => {

            const element =
                document.createElement("a");


            element.href =
                card.link;


            element.className = `
                group
                relative
                block
                overflow-hidden
                rounded-2xl
                border
                border-transparent
                bg-white
                p-6
                text-center
                no-underline
                shadow-[0_5px_20px_rgba(0,0,0,0.07)]
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-[0_18px_40px_rgba(0,0,0,0.14)]
            `;


            if (card.fullWidth === true) {

                element.classList.add(
                    "sm:col-span-2",
                    "lg:col-span-3"
                );

            }


            element.innerHTML = `

                <div
                    class="
                        absolute
                        left-0
                        top-0
                        h-1
                        w-full
                        origin-left
                        scale-x-0
                        transition-transform
                        duration-300
                        group-hover:scale-x-100
                    "
                    style="
                        background-color: ${card.color};
                    "
                ></div>


                <div
                    class="
                        mx-auto
                        mb-5
                        flex
                        h-[70px]
                        w-[70px]
                        items-center
                        justify-center
                        rounded-2xl
                        text-3xl
                        transition-all
                        duration-300
                        group-hover:scale-110
                        group-hover:-rotate-3
                    "
                    style="
                        background-color: ${card.iconBg};
                    "
                >
                    ${card.icon}
                </div>


                <h2
                    class="
                        mb-2
                        text-xl
                        font-bold
                        text-[#222]
                    "
                >
                    ${card.title}
                </h2>


                <p
                    class="
                        mb-5
                        min-h-[48px]
                        text-sm
                        leading-6
                        text-[#777]
                    "
                >
                    ${card.description}
                </p>


                <span
                    class="
                        inline-flex
                        items-center
                        justify-center
                        rounded-lg
                        px-5
                        py-2.5
                        text-sm
                        font-bold
                        text-white
                        transition-transform
                        duration-200
                        group-hover:translate-x-1
                    "
                    style="
                        background-color: ${card.color};
                    "
                >
                    ${card.button}
                </span>

            `;


            container.appendChild(
                element
            );

        });


    } catch (error) {

        console.error(
            "Home Cards Error:",
            error
        );


        container.innerHTML = `
            <div
                class="
                    col-span-full
                    rounded-xl
                    bg-red-50
                    p-5
                    text-center
                    text-sm
                    font-bold
                    text-red-600
                "
            >
                Cards could not be loaded.
            </div>
        `;

    }

}