import Review from '../models/Review.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { course, faculty, rating, feedback } = req.body;

    const newReview = new Review({
      course,
      faculty,
      rating,
      feedback,
      // postedBy stays default 'Anonymous'
    });

    await newReview.save();
    res.status(201).json({ message: 'Review posted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error posting review', error: err.message });
  }
};

// Get all reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
};
