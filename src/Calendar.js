import React from "react";
import dateFns from "date-fns";
import "./calendar.css";
import loadData from "./events.json";

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.eventclass = "eventday";
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      eventDate: [],
      show: false,
      title: "",
      description: "",
      imageFilename: ""
    };
  }
  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

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
                ? "today"
                : hasevent(day)
                ? this.eventclass
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
    const e = [];
    for (var i = 0; i < loadData.length; i++) {
      e.push(loadData[i]);
      var launchdate = dateFns.parse(loadData[i].launchDate);
      if (dateFns.isSameDay(day, launchdate)) {
        this.setState({
          show: true,
          title: e[i].title,
          description: e[i].description,
          imageFilename: e[i].imageFilename
        });
      }
    }
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

  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
        <Modal
          show={this.state.show}
          handleClose={this.hideModal}
          title={this.state.title}
          description={this.state.description}
          imageFilename={this.state.imageFilename}
        />
      </div>
    );
  }
}
const Modal = ({ handleClose, show, title, description, imageFilename }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="image-container">
          <img
            src={process.env.PUBLIC_URL + `./assets/${imageFilename}`}
            alt={title}
          />
        </div>
        <div className="text">
          <h4>{title}</h4>
          <p>{description}</p>
        </div>

        <button onClick={handleClose}>Close</button>
      </section>
    </div>
  );
};

export default Calendar;
