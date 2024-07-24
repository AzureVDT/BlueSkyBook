import moment from "moment";

export default function handleFormatTime(time: string) {
    return moment(time).format("DD/MM/YYYY HH:mm");
}
