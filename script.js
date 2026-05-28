dayjs.extend(dayjs_plugin_utc);
dayjs.extend(dayjs_plugin_timezone);

const defaultCities = [
    {
        city: "伊斯坦布尔",
        country: "Turkey",
        timezone: "Europe/Istanbul"
    },
    {
        city: "北京",
        country: "China",
        timezone: "Asia/Shanghai"
    },
    {
        city: "蒙特雷",
    country: "Mexico",
    timezone: "America/Monterrey"
    }
];

let cities = JSON.parse(localStorage.getItem("worldCities")) || defaultCities;

function saveCities() {
    localStorage.setItem("worldCities", JSON.stringify(cities));
}

function renderClocks() {

    $("#clockGrid").html("");

    cities.forEach((item, index) => {

        const now = dayjs().tz(item.timezone);

        const hour = now.hour();

        const mode = hour >= 6 && hour < 18 ? "day" : "night";

        const html = `
            <div class="clock-card ${mode}">

                <button class="remove-btn" onclick="removeCity(${index})">
                    ×
                </button>

                <div class="city">
                    ${item.city}
                </div>

                <div class="country">
                    ${item.country}
                </div>

                <div class="time">
                    ${now.format("HH:mm:ss")}
                </div>

                <div class="date">
                    ${now.format("YYYY-MM-DD dddd")}
                </div>

                <div class="tag">
                    ${item.timezone}
                </div>
            </div>
        `;

        $("#clockGrid").append(html);
    });
}

function removeCity(index) {
    cities.splice(index, 1);
    saveCities();
    renderClocks();
}

$("#addBtn").click(function () {

    const city = $("#cityName").val().trim();
    const country = $("#countryName").val().trim();
    const timezone = $("#timezone").val().trim();

    if (!city || !country || !timezone) {
        alert("请填写完整");
        return;
    }

    try {
        dayjs().tz(timezone);

        cities.push({
            city,
            country,
            timezone
        });

        saveCities();

        $("#cityName").val("");
        $("#countryName").val("");
        $("#timezone").val("");

        renderClocks();

    } catch (e) {
        alert("时区格式错误");
    }
});

renderClocks();

setInterval(renderClocks, 1000);
