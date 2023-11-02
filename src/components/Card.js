import React from "react";
import "./Card.css"; // Your custom CSS file for styling the card
function Card({ ticket, users, groupingOption }) {
  let available = false;

  const getImagePath = (userID) => {
    const user = users.find((user) => user.id === userID);
    available = user.available;

    return require(`../images/users/${userID}.png`);
  };

  return (
    <div className="custom-card">
      <div className="card-body">
        <div className="card-header">
          <div className="id">
            <span>{ticket.id}</span>
          </div>
          {groupingOption !== "user" && (
            <div className="img-section">
              <div className="user-img">
                <img
                  src={getImagePath(ticket.userId)}
                  alt="user-profile"
                  width="36px"
                  className="rounded-circle"
                />
                {available ? (
                  <div className="available-status success"></div>
                ) : (
                  <div className="available-status secondary"></div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="title-section">
          <p className="title">{ticket.title}</p>
        </div>
        <div className="feature-request">
          <div className="circle secondary"></div>
          <p className="tag">{ticket.tag}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
