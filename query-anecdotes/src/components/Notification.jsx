import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.message;
    case "CLEAR":
      return "";
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ""
  );

  return (
    <NotificationContext.Provider
      value={{ notification, notificationDispatch }}
    >
      {props.children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => {
  const { notification } = useContext(NotificationContext);
  return notification;
};

export const useNotificationDispatch = () => {
  const { notificationDispatch } = useContext(NotificationContext);
  return async (message) => {
    notificationDispatch({ type: "SET", message });
    setTimeout(() => notificationDispatch({ type: "CLEAR" }), 5000);
  };
};

const Notification = () => {
  const notification = useNotification();

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  return notification ? <div style={style}>{notification}</div> : null;
};

export default Notification;
