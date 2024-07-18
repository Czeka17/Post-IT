import React from 'react';
import classes from './notification.module.css'
interface NotificationProps {
  title: string;
  message: string | undefined;
  status: string;
}

function Notification({ title, message, status }:NotificationProps) {

      return(
        <div className={`${classes.notification} ${classes[status]}`}>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
      )
    }
    export default Notification;