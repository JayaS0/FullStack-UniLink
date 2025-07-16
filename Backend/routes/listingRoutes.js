import express from 'express';
import Listing from '../models/Listing.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new listing (admin and faculty)
router.post('/', verifyToken, async (req, res) => {
  const user = req.user;

  if (!['admin', 'faculty'].includes(user.role)) {
    return res.status(403).json({ message: 'Only admin or faculty can create listings' });
  }

  const { title, description, link, mediaUrls, company, category } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const newListing = new Listing({
      title,
      description,
      link,
      mediaUrls,
      company,
      category,
      createdBy: user.id,
    });

    await newListing.save();

    // Populate createdBy with safe fields before sending response
    const populatedListing = await Listing.findById(newListing._id).populate('createdBy', 'username role');

    res.status(201).json({ message: 'Listing created', listing: populatedListing });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all listings (any authenticated user)
router.get('/', verifyToken, async (req, res) => {
  try {
    const listings = await Listing.find().populate('createdBy', 'username role');
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get listing by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('createdBy', 'username role');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update listing by ID
router.put('/:id', verifyToken, async (req, res) => {
  const user = req.user;
  const listingId = req.params.id;
  const { title, description, link, mediaUrls, company, category } = req.body;

  if (!['admin', 'faculty'].includes(user.role)) {
    return res.status(403).json({ message: 'Only admin or faculty can update listings' });
  }

  try {
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (user.role !== 'admin' && listing.createdBy.toString() !== user.id) {
      return res.status(403).json({ message: 'You can only update your own listings' });
    }

    if (title) listing.title = title;
    if (description) listing.description = description;
    if (link !== undefined) listing.link = link;
    if (mediaUrls !== undefined) listing.mediaUrls = mediaUrls;
    if (company !== undefined) listing.company = company;
    if (category !== undefined) listing.category = category;

    await listing.save();

    // Populate before sending updated listing
    const populatedListing = await Listing.findById(listing._id).populate('createdBy', 'username role');

    res.json({ message: 'Listing updated', listing: populatedListing });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete listing by ID
router.delete('/:id', verifyToken, async (req, res) => {
  const user = req.user;
  const listingId = req.params.id;

  if (!['admin', 'faculty'].includes(user.role)) {
    return res.status(403).json({ message: 'Only admin or faculty can delete listings' });
  }

  try {
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    if (user.role !== 'admin' && listing.createdBy.toString() !== user.id) {
      return res.status(403).json({ message: 'You can only delete your own listings' });
    }

    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
