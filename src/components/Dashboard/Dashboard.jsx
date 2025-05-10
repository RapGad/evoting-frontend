import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Dashboard.css";
import { getCategoryFunc } from "../../redux/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../loading/Loading";
import { useNavigate } from "react-router-dom";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const Dashboard = () => {
  const { loading, category, error } = useSelector(
    (state) => state.getCategory
  );
  const { user } = useSelector(state=>state.verifyOtp)
  const [categories, setCategories] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getCategoryFunc());
  }, [dispatch]);

  useEffect(() => {
    if (category?.length) {
      setCategories(category);
    }
  }, [category]);

  const moveToCandidates=(id)=>{
    navigate(`/candidatelist/${id}`)

  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Welcome, <span>{user?.name}</span>!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Select a category to vote
        </motion.p>
      </header>
      {loading ? (
        <Loading />
      ) : (
        <motion.div
          className="categories-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.length === 0 ? (
  <p>No categories to show</p>
) : (
  categories
    .filter((category) => {
      const specificHostelId = user.hostel; // 🔁 Replace with the actual _id
      const isHostel = category.name.toLowerCase().includes("hostel");
      
      // Allow only the one hostel with specific ID, and all non-hostel categories
      return category._id === specificHostelId || !isHostel;
    })
    .map((category) => (
      <motion.div
        key={category._id}
        className="category-card"
        variants={cardVariants}
        whileHover={{ y: -10, scale: 1.03 }}
      >
        <div className="category-icon">{category.icon}</div>
        <h3>{category.name}</h3>
        <motion.button
          className="vote-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => moveToCandidates(category._id)}
        >
          Vote Now
        </motion.button>
      </motion.div>
    ))
)}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
