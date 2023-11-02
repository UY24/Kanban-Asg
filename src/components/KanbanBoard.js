import React, { useState, useEffect } from "react";
import { fetchData } from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faList, faSliders } from "@fortawesome/free-solid-svg-icons";
// import userImage from '../images/users/usr-1.png';

import Card from "./Card";
import "./KanbanBoard.css";

function KanbanBoard() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupingOption, setGroupingOption] = useState(
    localStorage.getItem("groupingOption") || "user"
  );
  const [sortingOption, setSortingOption] = useState(
    localStorage.getItem("sortingOption") || "priority"
  );
  const [displayOpen, setDisplayOpen] = useState(false);
  const priority = ["No priority", "Low", "Medium", "High", "Urgent"];
  let available = false;

  useEffect(() => {
    fetchData().then((data) => {
      setTickets(data.tickets);
      setUsers(data.users);
    });
  }, []);

  const groupAndSortTickets = (tickets, groupingOption, sortingOption) => {
    // Saving state on referesh
    localStorage.setItem("groupingOption", groupingOption);
    localStorage.setItem("sortingOption", sortingOption);

    // Grouping logic
    const groupedTickets = {};
    tickets.forEach((ticket) => {
      const groupKey =
        groupingOption === "status"
          ? ticket.status
          : groupingOption === "user"
          ? (ticket.userId
              ? users.find((user) => {
                  return user.id === ticket.userId;
                })
              : ""
            ).name
          : groupingOption === "priority"
          ? ticket.priority
          : "Other";

      if (!groupedTickets[groupKey]) {
        groupedTickets[groupKey] = [];
      }
      groupedTickets[groupKey].push(ticket);
    });

    // Sorting logic
    Object.keys(groupedTickets).forEach((groupKey) => {
      groupedTickets[groupKey].sort((a, b) => {
        if (sortingOption === "priority") {
          return b.priority - a.priority;
        } else if (sortingOption === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
    });

    return groupedTickets;
  };

  const groupedAndSortedTickets = groupAndSortTickets(
    tickets,
    groupingOption,
    sortingOption
  );

  const getStatusImgPath = (status) => {
    status = status.toLowerCase().replace(/\s+/g, "-");
    return require(`../images/logos/status/${status}.png`);
  };

  const getImagePath = (userName) => {
    const user = users.find((user) => {
      return user.name === userName;
    });
    console.log(user);
    available = user.available;

    const imagePath = require( `../images/users/${user.id}.png`);
    console.log("Image path:", imagePath);

    return imagePath;
  };

  const getPriorityImgPath = (priority) => {
    return require(`../images/logos/priorities/${priority}.png`);
  };

  return (
    <div className="kanban-board">
      <nav className="custom-navbar">
        <div className="dropdown">
          <button
            className="dropdown-toggle"
            type="button"
            onClick={() => setDisplayOpen(!displayOpen)}
          >
            <FontAwesomeIcon icon={faSliders} className="pe-1" />
            <span className="spanDis">Display</span>
          </button>
          {displayOpen && (
            // <ul className="dropdown-menu show">
            //   <li>
            //     <div>
            //       <p className="dropdown-item">Grouping</p>
            //       <select
            //         value={groupingOption}
            //         onChange={(e) => setGroupingOption(e.target.value)}
            //         className="form-select m-2"
            //       >
            //         <option value="status">Status</option>
            //         <option value="user">User</option>
            //         <option value="priority">Priority</option>
            //       </select>
            //     </div>
            //   </li>
            //   <li>
            //     <div>
            //       <p className="dropdown-item">Ordering</p>
            //       <select
            //         value={sortingOption}
            //         onChange={(e) => setSortingOption(e.target.value)}
            //         className="form-select"
            //       >
            //         <option value="priority">Priority</option>
            //         <option value="title">Title</option>
            //       </select>
            //     </div>
            //   </li>
            // </ul>
            <ul className="custom-dropdown-menu show">
              <li>
                <div className="custom-dropdown-item">
                  <p className="custom-dropdown-label">Grouping</p>
                  <select
                    value={groupingOption}
                    onChange={(e) => setGroupingOption(e.target.value)}
                    className="custom-dropdown-select"
                  >
                    <option value="status">Status</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
              </li>
              <li>
                <div className="custom-dropdown-item">
                  <p className="custom-dropdown-label">Ordering</p>
                  <select
                    value={sortingOption}
                    onChange={(e) => setSortingOption(e.target.value)}
                    className="custom-dropdown-select"
                  >
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                  </select>
                </div>
              </li>
            </ul>
          )}
        </div>
      </nav>

      {/* MAIN SECTION */}
      <div className="group-section">
        {groupedAndSortedTickets &&
          Object.keys(groupedAndSortedTickets).map((group) => (
            <div key={group} className="group">
              {/* GROUP HEADER SECTION*/}
              <div className="group-header">
                <div className="group-title">
                  {groupingOption === "status" && (
                    <div className="group-title-2">
                      <img
                        src={getStatusImgPath(group)}
                        width="36px"
                        alt="user-profile"
                      />

                      <h6>{group}</h6>
                      {groupedAndSortedTickets[group].length}
                    </div>
                  )}
                  {groupingOption === "user" && (
                    <div>
                      <div>
                        <div>
                          <img
                            src={getImagePath(group)}
                            width="36px"
                            alt="user"
                          />
                          {available ? (
                            <div className="available-status"></div>
                          ) : (
                            <div className="available-status"></div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h6>{group}</h6>
                      </div>
                    </div>
                  )}
                  {groupingOption === "priority" && (
                    <div>
                      <img
                        src={getPriorityImgPath(group)}
                        alt=""
                        width="30px"
                      />
                      <h6>{priority[group]}</h6>
                    </div>
                  )}
                </div>
                <div className="header-options">
                  <FontAwesomeIcon icon={faPlus} />
                  <FontAwesomeIcon icon={faList} />
                </div>
              </div>
              {/* CARDS SECTION */}
              <div className="cards">
                {groupedAndSortedTickets[group].map((ticket) => (
                  <Card
                    key={ticket.id}
                    ticket={ticket}
                    users={users}
                    groupingOption={groupingOption}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default KanbanBoard;
