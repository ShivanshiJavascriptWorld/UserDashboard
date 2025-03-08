import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BlockIcon from '@mui/icons-material/Block';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import userList from "../assets/extended_demo_data_1.json";


const UserDashboard = () => {
  const allRecords = userList;
  const [data, setData] = useState(allRecords.slice(0, 5));
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [filters, setFilters] = useState({ status: "", name: "", dateRange: null });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(allRecords.length / recordsPerPage);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 10) {
        setData(prevData => {
          const nextRecords = allRecords.slice(prevData.length, prevData.length + 5);
          return [...prevData, ...nextRecords];
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
  };
  const handleDateRangeChange = (dates) => {
    const [startDate, endDate] = dates;
    setFilters({ ...filters, dateRange: { startDate, endDate } });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ status: "", name: "", dateRange: "" });
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleStatusUpdate = (id, newStatus) => {

    setData(prevData => prevData.map(item => 
      item.id === id ? { ...item, about: { ...item.about, status: newStatus } } : item
    ));
  };

  const filteredData = data
  .filter((item) =>
    filters.status ? item.about.status.includes(filters.status) : true
  )
  .filter((item) =>
    filters.name ? item.about.name.toLowerCase().includes(filters.name.toLowerCase()) : true
  )
  .filter((item) => {
    if (filters.dateRange) {
      const userDate = new Date(item.details.date);
      const { startDate, endDate } = filters.dateRange;
      return (!startDate || userDate >= startDate) && (!endDate || userDate <= endDate);
    }
    return true;
  });



  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let valA, valB;
    if (sortConfig.key === "startDate") {
      valA = new Date(a.details.date);
      valB = new Date(b.details.date);
    } else if (sortConfig.key === "invitedBy") {
      valA = a.details.invitedBy;
      valB = b.details.invitedBy;
    } else if (sortConfig.key === "email") {
      valA = a.about.email;
      valB = b.about.email;
    } else {
      valA = a.about[sortConfig.key] || a.details[sortConfig.key];
      valB = b.about[sortConfig.key] || b.details[sortConfig.key];
    }

    if (sortConfig.direction === "asc") {
      return valA > valB ? 1 : valA < valB ? -1 : 0;
    } else {
      return valA < valB ? 1 : valA > valB ? -1 : 0;
    }
  });

  const currentRecords = sortedData.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  const totalUsers = allRecords.length;
  const blockedUsers = allRecords.filter(user => user.about.status === "BLOCKED").length;
  const activeUsers=allRecords.filter(user=>user.about.status==="ACTIVE").length;
//   const inactiveUsers = allRecords.filter(user => user.about.status !== "ACTIVE" && user.about.status!=="BLOCKED").length;

  return (
    <div className="container">
      <div className="header">
        <div className="left">
          <h2>User Details</h2>
          <p>Information about a user including name, start date, inviter, status, and available actions</p>
        </div>
        <button>Download Report</button>
      </div>

      <div className="user-summary">
        <div className="card">
          <div className="card-icon"><GroupsIcon style={{ color: "#00db7e", fontSize: "45px", background: "#ebfdf6" }} /></div>
          <div className="card-info">
            <h5>Total Users</h5>
            <h2>{totalUsers}</h2>
          </div>
          <div className="link"><LaunchIcon style={{ color: "#898989", background: "#fff", fontSize: "18px" }} /></div>
        </div>
        <div className="card">
          <div className="card-icon"><PersonAddIcon style={{ color: "#00db7e", fontSize: "45px", background: "#ebfdf6" }} /></div>
          <div className="card-info">
            <h5>Active Users</h5>
            <h2>{activeUsers}</h2>
          </div>
          <div className="link"><LaunchIcon style={{ color: "#898989", background: "#fff", fontSize: "18px" }} /></div>
        </div>
        <div className="card">
          <div className="card-icon"><PersonRemoveIcon style={{ color: "#00db7e", fontSize: "45px", background: "#ebfdf6" }} /></div>
          <div className="card-info">
            <h5>Inactive Users</h5>
            <h2>{(((totalUsers-activeUsers-blockedUsers) / totalUsers) * 100)}%</h2>
          </div>
          <div className="link"><LaunchIcon style={{ color: "#898989", background: "#fff", fontSize: "18px" }} /></div>
        </div>
        <div className="card">
          <div className="card-icon"><PersonOffIcon style={{ color: "#00db7e", fontSize: "45px", background: "#ebfdf6" }} /></div>
          <div className="card-info">
            <h5>Blocked Users</h5>
            <h2>{((blockedUsers / totalUsers) * 100)}%</h2>
          </div>
        </div>
      </div>

      <div className="func">
        <div className="search-bar">
          <span className="search-icon"><SearchIcon /></span>
          <input type="text" name="name" placeholder="Search" onChange={handleFilterChange} />
        </div>
        <div className="filter-options">
          <select name="status" onChange={handleFilterChange}>
            <option value="">Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INVITED">Inactive</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        

      <div className="date-range-input">
        <DatePicker
          selected={filters.dateRange?.startDate}
          onChange={handleDateRangeChange}
          startDate={filters.dateRange?.startDate}
          endDate={filters.dateRange?.endDate}
          selectsRange
          inline={false} 
          dateFormat="yyyy-MM-dd"
          placeholderText="Date"
          openToDate={filters.dateRange?.startDate}
        />
      </div>
              </div>
      </div>

      <div className="table-container">
        <div className="inner-table">
          <table className="user-table" style={{ height: "400px", overflowY: "auto" }}>
            <thead>
              <tr>
              <th onClick={() => handleSort("name")}>Name <span>⇅</span></th>
              <th onClick={() => handleSort("email")}>Email <span>⇅</span></th>
              <th onClick={() => handleSort("startDate")}>Start Date <span>⇅</span></th>
              <th onClick={() => handleSort("invitedBy")}>Invited By <span>⇅</span></th>
              <th onClick={() => handleSort("status")}>Status <span>⇅</span></th>
              <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((user, index) => (
                <tr key={index}>
                  <td style={{ color: "#242424" }}>{user.about.name}</td>
                  <td>{user.about.email}</td>
                  <td>{user.details.date}</td>
                  <td>{user.details.invitedBy}</td>
                  <td>
                    <span className={`status ${user.about.status.toLowerCase()}`}>{user.about.status}</span>
                  </td>
                  <td className="action-btns">
                    <button className="action-btn delete" onClick={() => handleStatusUpdate(user.id, "BLOCKED")}>
                      <BlockIcon style={{ fontSize: "15px" }} />
                    </button>
                    <button className="action-btn approve" onClick={() => handleStatusUpdate(user.id, "ACTIVE")}>
                      <CheckIcon style={{ fontSize: "15px" }} />
                    </button>
                    <button className="action-btn info" onClick={() => handleStatusUpdate(user.id, "INVITED")}>
                      <InfoOutlinedIcon style={{ fontSize: "15px" }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>‹</button>
        <span>Page</span>
        <select value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))}>
          {Array.from({ length: totalPages }, (_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        <span>of {totalPages}</span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>›</button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
      </div>
    </div>
  );
};

export default UserDashboard;
