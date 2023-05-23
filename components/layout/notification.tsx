import React from 'react';
import classes from './notification.module.css'
interface NotificationProps {
  title: string;
  message: string | undefined;
  status: string;
}

const Notification: React.FC<NotificationProps> = ({ title, message, status }) => {

    let statusClasses = '';

    if(status === 'success'){
        statusClasses = classes.success
    }

    if (status === 'error') {
        statusClasses = classes.error;
      }
    if (status === 'pending') {
      statusClasses = classes.pending
    }
      return(
        <div className={`${classes.notification} ${statusClasses}`}>
      <h2>{title}</h2> 
      <p>{message}</p>
    </div>
      )
    }
    export default Notification;