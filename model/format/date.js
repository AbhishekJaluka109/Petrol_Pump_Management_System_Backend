function formatDate(inputDate) {
    const date = new Date(inputDate);
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString().split("T")[0];
}

export default formatDate;