// Entry point for the build script in your package.json

import "trix";
import "@rails/actiontext";

import jquery from 'jquery';
window.jQuery = jquery;
window.$ = jquery;

import Highcharts from "highcharts";
require("highcharts/modules/data")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/offline-exporting")(Highcharts);
require("highcharts/modules/map")(Highcharts);
window.Highcharts = Highcharts;

import { DateTime } from "luxon";
import Litepicker from "litepicker";
import { Calendar } from "@fullcalendar/core";
import luxonPlugin from "@fullcalendar/luxon";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import toastr from "toastr";

// Global toastr options
window.toastr = toastr;
toastr.options = {
  timeOut: "1400",
};

function isMobileResolution() {
  return $(window).width() < 992;
}

function isShortHeightScreen() {
  return $(window).height() < 768 && !isMobileResolution();
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const isMobile = isMobileResolution();
    const isShortHeight = isShortHeightScreen();

    const calendarElement = document.getElementById("calendar");
    if (calendarElement) {
      new Calendar(calendarElement, {
        firstDay: 1,
        plugins: [luxonPlugin, dayGridPlugin, listPlugin],
        displayEventTime: true,
        eventLimit: true,
        events: "schedule.json",
        height: isMobile || isShortHeight ? "auto" : "parent",
        defaultView: isMobile ? "listWeek" : "month",
      }).render();
    }

    const rangeElement = document.getElementById("filters_date_range");
    if (!rangeElement) {
      return;
    }

    const today = DateTime.now();
    const startDate = new Date(rangeElement.dataset["initialStartDate"]);
    const endDate = new Date(rangeElement.dataset["initialEndDate"]);

    const picker = new Litepicker({
      element: rangeElement,
      plugins: ["ranges"],
      startDate: startDate,
      endDate: endDate,
      format: "MMMM D, YYYY",
      ranges: {
        customRanges: {
          "All Time": [
            today.minus({ years: 100 }).toJSDate(),
            today.toJSDate(),
          ],
          Today: [today.toJSDate(), today.toJSDate()],
          Yesterday: [
            today.minus({ days: 1 }).toJSDate(),
            today.minus({ days: 1 }).toJSDate(),
          ],
          "Last 7 Days": [
            today.minus({ days: 6 }).toJSDate(),
            today.toJSDate(),
          ],
          "Last 30 Days": [
            today.minus({ days: 29 }).toJSDate(),
            today.toJSDate(),
          ],
          "This Month": [
            today.startOf("month").toJSDate(),
            today.endOf("month").toJSDate(),
          ],
          "Last Month": [
            today.minus({ months: 1 }).startOf("month").toJSDate(),
            today.minus({ month: 1 }).endOf("month").toJSDate(),
          ],
          "This Year": [
            today.startOf("year").toJSDate(),
            today.endOf("year").toJSDate(),
          ],
        },
      },
    });
    picker.setDateRange(startDate, endDate);
  },
  false
);
