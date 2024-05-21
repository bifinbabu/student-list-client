import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [filters, setFilters] = useState({
    gender: "",
    minMarks: "",
    maxMarks: "",
  });

  useEffect(() => {
    fetchStudents();
  }, [page, pageSize, filters]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "https://student-list-api.vercel.app/students",
        {
          params: {
            page,
            pageSize,
            gender: filters.gender,
            minMarks: filters.minMarks,
            maxMarks: filters.maxMarks,
          },
        }
      );
      console.log("response", response.data?.data?.page);

      setStudents(response.data?.data?.students);
      setTotalPages(response.data?.data?.totalPages);
      setTotalStudents(response.data?.data?.totalStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
  };

  return (
    <div>
      <h1>Student List</h1>
      <div>
        <label>
          Gender:
          <select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label>
          Min Marks:
          <input
            type="number"
            name="minMarks"
            value={filters.minMarks}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          Max Marks:
          <input
            type="number"
            name="maxMarks"
            value={filters.maxMarks}
            onChange={handleFilterChange}
          />
        </label>
        <button onClick={() => setPage(1)}>Apply Filters</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Total Marks</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.gender}</td>
              <td>{student.totalMarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => setPage((page) => Math.max(page - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((page) => Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
      <div>
        <label>
          Page Size:
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default StudentList;
