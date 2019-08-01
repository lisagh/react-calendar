import React from "react";
import dateFns from "date-fns";
import "./calendar.css";
import loadData from "./events.json";

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      eventDate: [],
      showEvent: false
    };
    this.initialiseEvents();
  }

  renderHeader() {
    const dateFormat = "MMMM YYYY";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className=" icon fas fa-angle-left" onClick={this.prevMonth} />
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <div className="icon fas fa-angle-right" />
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    function hasevent(d) {
      var eventhappen;
      for (var i = 0; i < loadData.length; i++) {
        var launchdate = dateFns.parse(loadData[i].launchDate);
        if (dateFns.isSameDay(d, launchdate)) {
          eventhappen = true;
        }
      }
      return eventhappen;
    }

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate)
                ? "selected"
                : hasevent(day)
                ? "eventday"
                : ""
            }`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
        // console.log(day, hasevent(day));
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  onDateClick = day => {
    this.setState({
      selectedDate: day
    });
  };

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };

  initialiseEvents() {
    this.setState({
      showEvent: !this.state.showEvent
    });

    const e = [];
    for (var i = 0; i < loadData.length; i++) {
      e.push(loadData[i].title);
    }

    return <ul>{e}</ul>;
  }

  render() {
    return (
      <div className="calendar">
        {this.initialiseEvents()}
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    );
  }
}

export default Calendar;
