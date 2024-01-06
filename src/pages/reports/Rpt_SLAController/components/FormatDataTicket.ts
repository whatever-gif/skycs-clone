export function groupTicketsByDate(input: any) {
  const output: any = [];
  const dateMap = new Map();

  input?.forEach((ticket: any) => {
    const createDate = ticket.CreateDate.split("T")[0];

    if (!dateMap.has(createDate)) {
      dateMap.set(createDate, {
        Closed: 0,
        Open: 0,
        New: 0,
      });
    }

    if (ticket.AgentTicketStatusName === "Closed") {
      dateMap.get(createDate).Closed += ticket.QtyTicket;
    } else if (ticket.AgentTicketStatusName === "Open") {
      dateMap.get(createDate).Open += ticket.QtyTicket;
    } else if (ticket.AgentTicketStatusName === "New") {
      dateMap.get(createDate).New += ticket.QtyTicket;
    }
  });

  dateMap?.forEach((value, createDate) => {
    output.push({
      CreateDate: createDate,
      Closed: value.Closed,
      Open: value.Open,
      New: value.New,
    });
  });

  return output;
}
