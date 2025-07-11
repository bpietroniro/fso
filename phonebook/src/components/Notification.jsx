const Notification = ({ message, status }) => {
  return <div className={status}>{message}</div>;
};

export default Notification;
