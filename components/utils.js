export function comprehendOrdinal(n) {
  var s = ["th", "st", "nd", "rd"];
  var v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function formatNumberIntoReadable(num) {
  if (num > 999999999) {
    return `${(num / 1000000000).toFixed(1)}B`;
  } else if (num > 999999) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num > 999) {
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return num.toLocaleString();
  }
}

export function convertDateWithoutTime(datestr) {
  var dateObj = new Date(datestr);
  var currentDate = new Date();
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  if (
    currentDate.getFullYear() == dateObj.getFullYear() &&
    dateObj.getDate() == currentDate.getDate() &&
    dateObj.getMonth() == currentDate.getMonth()
  ) {
    return `today`;
  } else if (currentDate.getFullYear() == dateObj.getFullYear()) {
    return `${comprehendOrdinal(dateObj.getDate())}  ${
      months[dateObj.getMonth()]
    }`;
  } else {
    return `
      ${comprehendOrdinal(dateObj.getDate())}  ${
      months[dateObj.getMonth()]
    } ${dateObj.getFullYear()}`;
  }
}

export function convertDate(datestr) {
  var dateObj = new Date(datestr);
  var currentDate = new Date();
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  if (
    currentDate.getFullYear() == dateObj.getFullYear() &&
    dateObj.getDate() == currentDate.getDate() &&
    dateObj.getMonth() == currentDate.getMonth()
  ) {
    return `${
      dateObj.getHours() > 12 ? dateObj.getHours() - 12 : dateObj.getHours()
    }:${dateObj.getMinutes() < 10 ? "0" : ""}${dateObj.getMinutes()} ${
      dateObj.getHours() >= 12 ? "PM" : "AM"
    }`;
  } else if (currentDate.getFullYear() == dateObj.getFullYear()) {
    return `${
      dateObj.getHours() > 12 ? dateObj.getHours() - 12 : dateObj.getHours()
    }:${dateObj.getMinutes() < 10 ? "0" : ""}${dateObj.getMinutes()} ${
      dateObj.getHours() >= 12 ? "PM" : "AM"
    }, %%%${comprehendOrdinal(dateObj.getDate())}  ${
      months[dateObj.getMonth()]
    }`;
  } else {
    return `${
      dateObj.getHours() > 12 ? dateObj.getHours() - 12 : dateObj.getHours()
    }:${dateObj.getMinutes() < 10 ? "0" : ""}${dateObj.getMinutes()} ${
      dateObj.getHours() >= 12 ? "PM" : "AM"
    }, %%%${comprehendOrdinal(dateObj.getDate())}  ${
      months[dateObj.getMonth()]
    } ${dateObj.getFullYear()}`;
  }
}
export const base64ToUint8Array = (base64) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};