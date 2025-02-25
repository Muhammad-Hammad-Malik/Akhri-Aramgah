import React from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function TransporterOrders() {
  const [transporterOrders, settransporterOrders] = useState([
    {
      id: "1",
      destination: "Park View Society",
      fare: 2000,
      date: "20-12-2024",
    },
    {
      id: "2",
      destination: "Revenue Society",
      fare: 600,
      date: "20-12-2024",
    },
  ]);
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!", {
        position: "bottom-right",
        autoClose: 1000,
      });
    });
  };
  return (
    <>
      <div className="col-lg-6 orders-col-lg-6">
        <div className="card dashboard-active-orders orders-card">
          <h2 className="card-title orders-card-title">
            Transportation Orders
          </h2>
          <div className="card-content orders-card-content">
            {transporterOrders.length === 0 ? (
              <p className="no-orders-message">No Past orders</p>
            ) : (
              transporterOrders.map((graveOrder, index) => (
                <div key={index} className="orders-order-item">
                  <p>
                    <strong>Order ID:</strong> {graveOrder.id}  
                    <i
                      className="fa fa-clipboard orders-copy-button"
                      onClick={() => copyToClipboard(graveOrder.id)}
                      style={{ cursor: "pointer" }}
                    ></i>
                  </p>
                  <p>
                    <strong>Destination:</strong> {graveOrder.destination}
                  </p>
                  <p>
                    <strong>Fare</strong> {graveOrder.fare}
                  </p>
                  <p>
                    <strong>Date</strong> {graveOrder.date}
                  </p>
                  {index < transporterOrders.length - 1 && (
                    <hr className="orders-hr" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
