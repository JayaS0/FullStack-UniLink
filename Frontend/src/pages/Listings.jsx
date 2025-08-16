// import { useState } from "react";

// export default function StudentListingsPage({ userRole = "student" }) {
//   const primaryColor = "#1C2E4A";
//   const primaryHover = "#163059";
//   const grayPrimary = "#888";
//   const grayHover = "#666";

//   const [previewImage, setPreviewImage] = useState(null);

//   // Filter/Search states
//   const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   // Listings data state
//   const [listings, setListings] = useState([
//     {
//       id: 1,
//       title: "Job Opening: Developer",
//       description: "Hiring junior devs",
//       link: "https://company.com/jobs",
//       mediaUrls: ["https://image.com/job.png"],
//       company: "Tech Corp",
//       category: "job",
//       userSubmitted: false,
//     },
//     {
//       id: 2,
//       title: "Internship: Marketing Intern",
//       description: "Looking for marketing intern",
//       link: "",
//       mediaUrls: [],
//       company: "Market Masters",
//       category: "internship",
//       userSubmitted: false,
//     },
//   ]);

//   // Modal states
//   const [showForm, setShowForm] = useState(false);
//   const [showDetail, setShowDetail] = useState(false);
//   const [detailListing, setDetailListing] = useState(null);

//   // Form fields
//   const [formId, setFormId] = useState(null);
//   const [formTitle, setFormTitle] = useState("");
//   const [formDescription, setFormDescription] = useState("");
//   const [formLink, setFormLink] = useState("");
//   const [formMediaFiles, setFormMediaFiles] = useState([]); // File[]
//   const [formMediaPreviews, setFormMediaPreviews] = useState([]); // preview URLs for new files
//   const [formMediaUrls, setFormMediaUrls] = useState([]); // existing media URLs for editing
//   const [formCompany, setFormCompany] = useState("");
//   const [formCategory, setFormCategory] = useState("job");

//   // Filter listings by category & search
//   const filteredListings = listings.filter((l) => {
//     const matchesCategory =
//       !selectedCategoryFilter || l.category === selectedCategoryFilter;
//     const matchesSearch =
//       !searchTerm ||
//       l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       l.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       l.company.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   // Reset form fields
//   const resetForm = () => {
//     setFormId(null);
//     setFormTitle("");
//     setFormDescription("");
//     setFormLink("");
//     setFormMediaFiles([]);
//     setFormMediaPreviews([]);
//     setFormMediaUrls([]);
//     setFormCompany("");
//     setFormCategory("job");
//   };

//   // Open new listing modal
//   const openFormNew = () => {
//     if (userRole === "faculty" || userRole === "admin") {
//       resetForm();
//       setShowForm(true);
//     } else {
//       alert("Only faculty and admin can upload listings.");
//     }
//   };

//   // Open edit modal with listing data
//   const openFormEdit = (listing) => {
//     setFormId(listing.id);
//     setFormTitle(listing.title);
//     setFormDescription(listing.description);
//     setFormLink(listing.link || "");
//     setFormMediaFiles([]);
//     setFormMediaUrls(listing.mediaUrls || []);
//     setFormCompany(listing.company || "");
//     setFormCategory(listing.category || "job");
//     setShowForm(true);
//   };

//   // Handle selecting images (new files)
//   const handleMediaChange = (e) => {
//     const files = Array.from(e.target.files);
//     setFormMediaFiles(files);

//     // Create preview URLs for new files
//     const previews = files.map((file) => URL.createObjectURL(file));
//     setFormMediaPreviews(previews);
//   };

//   // Remove preview image from new files
//   const removePreview = (index) => {
//     setFormMediaPreviews((prev) => {
//       const arr = [...prev];
//       arr.splice(index, 1);
//       return arr;
//     });
//     setFormMediaFiles((prev) => {
//       const arr = [...prev];
//       arr.splice(index, 1);
//       return arr;
//     });
//   };

//   // Remove existing media URL (editing)
//   const removeExistingMediaUrl = (index) => {
//     setFormMediaUrls((prev) => {
//       const arr = [...prev];
//       arr.splice(index, 1);
//       return arr;
//     });
//   };

//   // Submit form (create/update)
//   const handleSubmitForm = (e) => {
//     e.preventDefault();

//     if (!formTitle.trim() || !formDescription.trim() || !formCompany.trim() || !formCategory.trim()) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     // Combine existing URLs + new previews (simulate upload)
//     const uploadedMediaUrls = [...formMediaUrls, ...formMediaPreviews];

//     if (formId) {
//       // Update
//       setListings((prev) =>
//         prev.map((l) =>
//           l.id === formId
//             ? {
//                 ...l,
//                 title: formTitle,
//                 description: formDescription,
//                 link: formLink.trim() || "",
//                 mediaUrls: uploadedMediaUrls,
//                 company: formCompany,
//                 category: formCategory.toLowerCase(),
//                 userSubmitted: true,
//               }
//             : l
//         )
//       );
//       alert("Listing updated!");
//     } else {
//       // Create new
//       const newListing = {
//         id: Date.now(),
//         title: formTitle,
//         description: formDescription,
//         link: formLink.trim() || "",
//         mediaUrls: uploadedMediaUrls,
//         company: formCompany,
//         category: formCategory.toLowerCase(),
//         userSubmitted: true,
//       };
//       setListings((prev) => [newListing, ...prev]);
//       alert("Listing submitted!");
//     }

//     // Cleanup previews
//     formMediaPreviews.forEach((url) => URL.revokeObjectURL(url));

//     resetForm();
//     setShowForm(false);
//   };

//   // Open detail modal on listing click
//   const openDetail = (listing) => {
//     setDetailListing(listing);
//     setShowDetail(true);
//   };

//   // Delete listing (faculty/admin only)
//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this listing?")) {
//       setListings((prev) => prev.filter((l) => l.id !== id));
//       setShowDetail(false);
//       if (formId === id) resetForm();
//     }
//   };

//   // Check edit permission
//   const canEdit = userRole === "faculty" || userRole === "admin";

//   // Shared button style helper
//   const buttonStyle = (bg, hover, flex1 = false) => ({
//     flex: flex1 ? 1 : "unset",
//     padding: "10px 15px",
//     background: bg,
//     color: "white",
//     border: "none",
//     borderRadius: 6,
//     cursor: "pointer",
//     fontWeight: 600,
//     fontSize: 15,
//     userSelect: "none",
//     outline: "none",
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     minWidth: flex1 ? "auto" : 90,
//     transition: "background-color 0.3s ease",
//   });

//   // Form input styles
//   const formInputStyle = {
//     padding: "10px 12px",
//     borderRadius: 6,
//     border: "1px solid #ccc",
//     fontSize: 15,
//     outlineColor: primaryColor,
//     boxSizing: "border-box",
//     color: primaryColor,
//   };

//   return (
//     <div style={{ padding: 20, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: primaryColor }}>
//       <h2 style={{ marginBottom: 20, userSelect: "none" }}>Listings</h2>

//       {/* Controls */}
//       <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
//         <input
//           type="text"
//           placeholder="Search listings..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             flex: 1,
//             minWidth: 200,
//             padding: 10,
//             borderRadius: 6,
//             border: `1px solid ${primaryColor}`,
//             outlineColor: primaryColor,
//             fontSize: 16,
//             color: primaryColor,
//           }}
//         />

//         <select
//           value={selectedCategoryFilter}
//           onChange={(e) => setSelectedCategoryFilter(e.target.value)}
//           style={{
//             padding: 10,
//             borderRadius: 6,
//             border: `1px solid ${primaryColor}`,
//             fontSize: 16,
//             color: primaryColor,
//             cursor: "pointer",
//             minWidth: 140,
//           }}
//         >
//           <option value="">All Categories</option>
//           <option value="job">Job</option>
//           <option value="internship">Internship</option>
//         </select>

//         <button
//           onClick={() => {
//             setSelectedCategoryFilter("");
//             setSearchTerm("");
//           }}
//           style={buttonStyle(grayPrimary, grayHover)}
//           onMouseEnter={(e) => (e.currentTarget.style.background = grayHover)}
//           onMouseLeave={(e) => (e.currentTarget.style.background = grayPrimary)}
//         >
//           Reset
//         </button>

//         <button
//           onClick={openFormNew}
//           style={buttonStyle(primaryColor, primaryHover)}
//           onMouseEnter={(e) => (e.currentTarget.style.background = primaryHover)}
//           onMouseLeave={(e) => (e.currentTarget.style.background = primaryColor)}
//         >
//           Upload Listing
//         </button>
//       </div>

//       {/* Listings Grid */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//           gap: 20,
//           color: primaryColor,
//         }}
//       >
//         {filteredListings.length > 0 ? (
//           filteredListings.map((l) => (
//             <div
//               key={l.id}
//               tabIndex={0}
//               role="button"
//               aria-pressed="false"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" || e.key === " ") openDetail(l);
//               }}
//               style={{
//                 position: "relative",
//                 padding: 15,
//                 border: `1px solid ${primaryColor}`,
//                 borderRadius: 6,
//                 boxShadow: "0 1px 5px rgba(28, 46, 74, 0.1)",
//                 backgroundColor: "#fefefe",
//                 userSelect: "none",
//                 cursor: "pointer",
//                 transition: "box-shadow 0.3s ease",
//                 display: "flex",
//                 flexDirection: "column",
//                 outline: "none",
//               }}
//               onClick={() => openDetail(l)}
//             >
//               {/* Three dots menu ONLY on cards and only for admin/faculty */}
//               {canEdit && (
//                 <div
//                   onClick={(e) => e.stopPropagation()}
//                   style={{ position: "absolute", top: 8, right: 8 }}
//                 >
//                   <button
//                     aria-label="Open listing options"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       const menu = document.getElementById(`listing-options-menu-${l.id}`);
//                       if (menu) {
//                         menu.style.display = menu.style.display === "block" ? "none" : "block";
//                       }
//                     }}
//                     style={{
//                       background: "transparent",
//                       border: "none",
//                       cursor: "pointer",
//                       fontSize: 24,
//                       userSelect: "none",
//                       color: primaryColor,
//                       padding: 0,
//                       lineHeight: 1,
//                     }}
//                   >
//                     ⋮
//                   </button>
//                   <div
//                     id={`listing-options-menu-${l.id}`}
//                     style={{
//                       display: "none",
//                       position: "absolute",
//                       right: 0,
//                       top: "30px",
//                       background: "white",
//                       border: `1px solid ${primaryColor}55`,
//                       borderRadius: 6,
//                       boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
//                       zIndex: 10,
//                       minWidth: 120,
//                       userSelect: "none",
//                     }}
//                   >
//                     <button
//                       onClick={() => {
//                         openFormEdit(l);
//                         const menu = document.getElementById(`listing-options-menu-${l.id}`);
//                         if (menu) menu.style.display = "none";
//                       }}
//                       style={{
//                         width: "100%",
//                         padding: "10px",
//                         border: "none",
//                         background: "none",
//                         textAlign: "left",
//                         cursor: "pointer",
//                         color: primaryColor,
//                       }}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => {
//                         handleDelete(l.id);
//                         const menu = document.getElementById(`listing-options-menu-${l.id}`);
//                         if (menu) menu.style.display = "none";
//                       }}
//                       style={{
//                         width: "100%",
//                         padding: "10px",
//                         border: "none",
//                         background: "none",
//                         textAlign: "left",
//                         cursor: "pointer",
//                         color: "#d9534f",
//                       }}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               )}

//               <h4 style={{ marginBottom: 8, color: primaryColor }}>{l.title}</h4>
//               <p style={{ fontSize: 14, color: "#555", marginBottom: 10 }}>{l.description}</p>
//               <div style={{ fontWeight: "600", marginBottom: 6, color: primaryColor }}>
//                 Category: {l.category}
//               </div>
//               <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10, minHeight: 60 }}>
//                 {(l.mediaUrls || []).map((url, idx) => (
//                   <img
//                     key={idx}
//                     src={url}
//                     alt={`listing-img-${idx}`}
//                     style={{
//                       width: 60,
//                       height: 60,
//                       objectFit: "cover",
//                       borderRadius: 4,
//                       border: `1px solid ${primaryColor}33`,
//                       userSelect: "none",
//                     }}
//                     draggable={false}
//                   />
//                 ))}
//               </div>
//               <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5, marginTop: "auto" }}>
//                 <div>
//                   <strong>Company:</strong> {l.company}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div style={{ color: "#777", gridColumn: "1 / -1", userSelect: "none" }}>No listings match your filters.</div>
//         )}
//       </div>

//       {/* Listing Detail Modal */}
//       {showDetail && detailListing && (
//         <>
//           <div
//             onClick={() => setShowDetail(false)}
//             style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1000, cursor: "pointer" }}
//           />
//           <div
//             style={{
//               position: "fixed",
//               top: "5%",
//               left: "50%",
//               transform: "translateX(-50%)",
//               background: "white",
//               borderRadius: 8,
//               padding: 20,
//               width: "90%",
//               maxWidth: 600,
//               boxShadow: `0 5px 15px ${primaryColor}44`,
//               zIndex: 1001,
//               maxHeight: "90vh",
//               overflowY: "auto",
//               color: primaryColor,
//               userSelect: "text",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: 15,
//               }}
//             >
//               <h3>{detailListing.title}</h3>
//               {/* No three dots menu here */}
//             </div>

//             <p style={{ marginBottom: 15 }}>{detailListing.description}</p>

//             {detailListing.link && (
//               <p style={{ marginBottom: 15 }}>
//                 <strong>Link: </strong>
//                 <a href={detailListing.link} target="_blank" rel="noopener noreferrer" style={{ color: primaryColor }}>
//                   {detailListing.link}
//                 </a>
//               </p>
//             )}

//             {detailListing.mediaUrls && detailListing.mediaUrls.length > 0 && (
//               <div
//                 style={{
//                   display: "flex",
//                   gap: 12,
//                   flexWrap: "wrap",
//                   marginBottom: 15,
//                 }}
//               >
//                 {detailListing.mediaUrls.map((url, idx) => (
//                   <img
//                     key={idx}
//                     src={url}
//                     alt={`media-${idx}`}
//                     style={{
//                       maxWidth: 120,
//                       maxHeight: 120,
//                       objectFit: "cover",
//                       borderRadius: 6,
//                       border: `1px solid ${primaryColor}33`,
//                       userSelect: "none",
//                     }}
//                     draggable={false}
//                   />
//                 ))}
//               </div>
//             )}

//             <div style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 15 }}>
//               <div>
//                 <strong>Company:</strong> {detailListing.company}
//               </div>
//               <div>
//                 <strong>Category:</strong> {detailListing.category}
//               </div>
//             </div>

//             <button
//               onClick={() => setShowDetail(false)}
//               style={buttonStyle(primaryColor, primaryHover)}
//               onMouseEnter={(e) => (e.currentTarget.style.background = primaryHover)}
//               onMouseLeave={(e) => (e.currentTarget.style.background = primaryColor)}
//             >
//               Close
//             </button>
//           </div>
//         </>
//       )}

//       {/* Listing Add/Edit Modal */}
//       {showForm && (
//         <>
//           <div
//             onClick={() => setShowForm(false)}
//             style={{
//               position: "fixed",
//               inset: 0,
//               backgroundColor: "rgba(0,0,0,0.4)",
//               zIndex: 1000,
//               cursor: "pointer",
//             }}
//           />
//           <div
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="form-title"
//             style={{
//               position: "fixed",
//               top: "5%",
//               left: "50%",
//               transform: "translateX(-50%)",
//               background: "white",
//               borderRadius: 8,
//               padding: 20,
//               width: "90%",
//               maxWidth: 600,
//               boxShadow: `0 5px 15px ${primaryColor}44`,
//               zIndex: 1001,
//               maxHeight: "90vh",
//               overflowY: "auto",
//               color: primaryColor,
//               userSelect: "text",
//             }}
//           >
//             <h3 id="form-title" style={{ marginBottom: 15 }}>
//               {formId ? "Edit Listing" : "Upload Listing"}
//             </h3>
//             <form onSubmit={handleSubmitForm}>
//               <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
//                 Title*:
//                 <input
//                   type="text"
//                   value={formTitle}
//                   onChange={(e) => setFormTitle(e.target.value)}
//                   required
//                   style={{ ...formInputStyle, width: "100%", marginTop: 4 }}
//                   maxLength={100}
//                 />
//               </label>

//               <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
//                 Description*:
//                 <textarea
//                   value={formDescription}
//                   onChange={(e) => setFormDescription(e.target.value)}
//                   required
//                   style={{ ...formInputStyle, width: "100%", marginTop: 4, minHeight: 80, resize: "vertical" }}
//                   maxLength={1000}
//                 />
//               </label>

//               <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
//                 Link (optional):
//                 <input
//                   type="url"
//                   value={formLink}
//                   onChange={(e) => setFormLink(e.target.value)}
//                   placeholder="https://example.com"
//                   style={{ ...formInputStyle, width: "100%", marginTop: 4 }}
//                 />
//               </label>

//               <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
//                 Upload Images (optional):
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleMediaChange}
//                   style={{ display: "block", marginTop: 6 }}
//                 />
//               </label>

//               {/* Show previews of new images */}
//               {formMediaPreviews.length > 0 && (
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 10,
//                     flexWrap: "wrap",
//                     marginBottom: 10,
//                     marginTop: 6,
//                   }}
//                 >
//                   {formMediaPreviews.map((url, i) => (
//                     <div
//                       key={i}
//                       style={{ position: "relative", display: "inline-block" }}
//                     >
//                       <img
//                         src={url}
//                         alt={`preview-${i}`}
//                         style={{
//                           width: 70,
//                           height: 70,
//                           objectFit: "cover",
//                           borderRadius: 6,
//                           border: `1px solid ${primaryColor}33`,
//                           userSelect: "none",
//                         }}
//                         draggable={false}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removePreview(i)}
//                         aria-label="Remove preview image"
//                         style={{
//                           position: "absolute",
//                           top: -6,
//                           right: -6,
//                           background: "#d9534f",
//                           borderRadius: "50%",
//                           border: "none",
//                           color: "white",
//                           width: 22,
//                           height: 22,
//                           cursor: "pointer",
//                           fontWeight: "bold",
//                           userSelect: "none",
//                         }}
//                       >
//                         ×
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Show existing media URLs for editing */}
//               {formMediaUrls.length > 0 && (
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 10,
//                     flexWrap: "wrap",
//                     marginBottom: 10,
//                     marginTop: 6,
//                   }}
//                 >
//                   {formMediaUrls.map((url, i) => (
//                     <div
//                       key={i}
//                       style={{ position: "relative", display: "inline-block" }}
//                     >
//                       <img
//                         src={url}
//                         alt={`existing-media-${i}`}
//                         style={{
//                           width: 70,
//                           height: 70,
//                           objectFit: "cover",
//                           borderRadius: 6,
//                           border: `1px solid ${primaryColor}33`,
//                           userSelect: "none",
//                         }}
//                         draggable={false}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeExistingMediaUrl(i)}
//                         aria-label="Remove existing image"
//                         style={{
//                           position: "absolute",
//                           top: -6,
//                           right: -6,
//                           background: "#d9534f",
//                           borderRadius: "50%",
//                           border: "none",
//                           color: "white",
//                           width: 22,
//                           height: 22,
//                           cursor: "pointer",
//                           fontWeight: "bold",
//                           userSelect: "none",
//                         }}
//                       >
//                         ×
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
//                 Company*:
//                 <input
//                   type="text"
//                   value={formCompany}
//                   onChange={(e) => setFormCompany(e.target.value)}
//                   required
//                   style={{ ...formInputStyle, width: "100%", marginTop: 4 }}
//                   maxLength={100}
//                 />
//               </label>

//               <label style={{ display: "block", marginBottom: 15, fontWeight: 600 }}>
//                 Category*:
//                 <select
//                   value={formCategory}
//                   onChange={(e) => setFormCategory(e.target.value)}
//                   required
//                   style={{ ...formInputStyle, width: "100%", marginTop: 4, cursor: "pointer" }}
//                 >
//                   <option value="job">Job</option>
//                   <option value="internship">Internship</option>
//                 </select>
//               </label>

//               <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     resetForm();
//                     setShowForm(false);
//                   }}
//                   style={buttonStyle(grayPrimary, grayHover)}
//                   onMouseEnter={(e) => (e.currentTarget.style.background = grayHover)}
//                   onMouseLeave={(e) => (e.currentTarget.style.background = grayPrimary)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   style={buttonStyle(primaryColor, primaryHover)}
//                   onMouseEnter={(e) => (e.currentTarget.style.background = primaryHover)}
//                   onMouseLeave={(e) => (e.currentTarget.style.background = primaryColor)}
//                 >
//                   {formId ? "Save Changes" : "Upload Listing"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </>
//       )}

//       {/* Image Preview Modal */}
//       {previewImage && (
//         <>
//           <div
//             onClick={() => setPreviewImage(null)}
//             style={{
//               position: "fixed",
//               inset: 0,
//               backgroundColor: "rgba(0,0,0,0.7)",
//               zIndex: 1100,
//               cursor: "pointer",
//             }}
//           />
//           <img
//             src={previewImage}
//             alt="preview full"
//             onClick={() => setPreviewImage(null)}
//             style={{
//               position: "fixed",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               maxWidth: "90vw",
//               maxHeight: "90vh",
//               borderRadius: 8,
//               boxShadow: `0 5px 20px ${primaryColor}bb`,
//               zIndex: 1101,
//               userSelect: "none",
//               cursor: "zoom-out",
//             }}
//           />
//         </>
//       )}
//     </div>
//   );
// }







import { useState, useEffect } from "react";
import axios from "axios";

export default function StudentListingsPage({ userRole = "student" }) {
  const primaryColor = "#1C2E4A";
  const primaryHover = "#163059";
  const grayPrimary = "#888";
  const grayHover = "#666";

  const [previewImage, setPreviewImage] = useState(null);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [listings, setListings] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailListing, setDetailListing] = useState(null);

  const [formId, setFormId] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formLink, setFormLink] = useState("");
  const [formMediaFiles, setFormMediaFiles] = useState([]);
  const [formMediaPreviews, setFormMediaPreviews] = useState([]);
  const [formMediaUrls, setFormMediaUrls] = useState([]);
  const [formCompany, setFormCompany] = useState("");
  const [formCategory, setFormCategory] = useState("job");

  const canEdit = userRole === "faculty" || userRole === "admin";

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:1000/api/listings", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setListings(
      res.data.map((l) => ({
        id: l._id,
        title: l.title,
        description: l.description,
        link: l.link || "",
        mediaUrls: l.mediaUrls || [],
        company: l.company || "",
        category: l.category || "job",
        createdBy: l.createdBy
          ? {
              id: l.createdBy._id,
              username: l.createdBy.username,
              role: l.createdBy.role,
            }
          : null,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt,
      }))
    );
  } catch (err) {
    console.error("Failed to fetch listings:", err);
  }
};


  const resetForm = () => {
    setFormId(null);
    setFormTitle("");
    setFormDescription("");
    setFormLink("");
    setFormMediaFiles([]);
    setFormMediaPreviews([]);
    setFormMediaUrls([]);
    setFormCompany("");
    setFormCategory("job");
  };

  const openFormNew = () => {
    if (canEdit) {
      resetForm();
      setShowForm(true);
    } else {
      alert("Only faculty and admin can upload listings.");
    }
  };

  const openFormEdit = (listing) => {
    setFormId(listing.id);
    setFormTitle(listing.title);
    setFormDescription(listing.description);
    setFormLink(listing.link || "");
    setFormMediaFiles([]);
    setFormMediaUrls(listing.mediaUrls || []);
    setFormCompany(listing.company || "");
    setFormCategory(listing.category || "job");
    setShowForm(true);
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setFormMediaFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setFormMediaPreviews(previews);
  };

  const removePreview = (index) => {
    setFormMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    setFormMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingMediaUrl = (index) => {
    setFormMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (
      !formTitle.trim() ||
      !formDescription.trim() ||
      !formCompany.trim() ||
      !formCategory.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const uploadedMediaUrls = [...formMediaUrls, ...formMediaPreviews];
    const token = localStorage.getItem("token");
//update listing
    try {
      if (formId) {
        await axios.put(
          `http://localhost:1000/api/listings/${formId}`,
          {
            title: formTitle,
            description: formDescription,
            link: formLink,
            mediaUrls: uploadedMediaUrls,
            company: formCompany,
            category: formCategory.toLowerCase(),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Listing updated!");
      } else {
        //create new listing
        await axios.post(
          `http://localhost:1000/api/listings`,
          {
            title: formTitle,
            description: formDescription,
            link: formLink,
            mediaUrls: uploadedMediaUrls,
            company: formCompany,
            category: formCategory.toLowerCase(),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Listing submitted!");
      }
      fetchListings();
      resetForm();
      setShowForm(false);
      formMediaPreviews.forEach((url) => URL.revokeObjectURL(url));
    } catch (err) {
      console.error("Failed to submit listing:", err);
      alert("Failed to submit listing.");
    }
  };

  const openDetail = (listing) => {
    setDetailListing(listing);
    setShowDetail(true);
  };
//delete listing
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:1000/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchListings();
      setShowDetail(false);
      if (formId === id) resetForm();
    } catch (err) {
      console.error("Failed to delete listing:", err);
      alert("Failed to delete listing.");
    }
  };

  const filteredListings = listings.filter((l) => {
    const matchesCategory =
      !selectedCategoryFilter || l.category === selectedCategoryFilter;
    const matchesSearch =
      !searchTerm ||
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formInputStyle = {
    padding: "8px 10px",
    border: "1px solid #ccc",
    borderRadius: 6,
    outline: "none",
    fontSize: 14,
  };

  const buttonStyle = (bg, hover) => ({
    background: bg,
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    transition: "background 0.2s",
  });

  return (
    <div style={{ padding: 20 }}>
      {/* Top controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          style={formInputStyle}
        >
          <option value="">All Categories</option>
          <option value="job">Job</option>
          <option value="internship">Internship</option>
        </select>
        <input
          type="text"
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...formInputStyle, flex: 1 }}
        />
        {canEdit && (
          <button
            onClick={openFormNew}
            style={buttonStyle(primaryColor, primaryHover)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = primaryHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = primaryColor)
            }
          >
            + New Listing
          </button>
        )}
      </div>

      {/* Listings grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 15,
        }}
      >
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            style={{
              border: `1px solid ${primaryColor}33`,
              borderRadius: 8,
              padding: 15,
              background: "white",
              cursor: "pointer",
            }}
            onClick={() => openDetail(listing)}
          >
            <h3>{listing.title}</h3>
            <p>{listing.company}</p>
            <p style={{ color: "#555" }}>
              {listing.description.slice(0, 60)}...
            </p>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {showDetail && detailListing && (
        <>
          <div
            onClick={() => setShowDetail(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 1000,
              cursor: "pointer",
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed",
              top: "5%",
              left: "50%",
              transform: "translateX(-50%)",
              background: "white",
              borderRadius: 8,
              padding: 20,
              width: "90%",
              maxWidth: 600,
              boxShadow: `0 5px 15px ${primaryColor}44`,
              zIndex: 1001,
              maxHeight: "90vh",
              overflowY: "auto",
              color: primaryColor,
            }}
          >
            <h3 style={{ marginBottom: 10 }}>{detailListing.title}</h3>
            <p style={{ marginBottom: 6 }}>
              <strong>Company:</strong> {detailListing.company}
            </p>
            <p style={{ marginBottom: 6 }}>
              <strong>Category:</strong> {detailListing.category}
            </p>
            <p style={{ marginBottom: 15 }}>{detailListing.description}</p>
            {detailListing.link && (
              <a
                href={detailListing.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: primaryColor,
                  display: "block",
                  marginBottom: 10,
                }}
              >
                View More
              </a>
            )}
            {detailListing.mediaUrls.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: 10,
                }}
              >
                {detailListing.mediaUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`media-${i}`}
                    style={{
                      width: 70,
                      height: 70,
                      objectFit: "cover",
                      borderRadius: 6,
                      border: `1px solid ${primaryColor}33`,
                      cursor: "pointer",
                    }}
                    onClick={() => setPreviewImage(url)}
                  />
                ))}
              </div>
            )}
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
            >
              {canEdit && (
                <>
                  <button
                    onClick={() => {
                      openFormEdit(detailListing);
                      setShowDetail(false);
                    }}
                    style={buttonStyle(primaryColor, primaryHover)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = primaryHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = primaryColor)
                    }
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(detailListing.id)}
                    style={buttonStyle("#d9534f", "#b52b27")}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#b52b27")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#d9534f")
                    }
                  >
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDetail(false)}
                style={buttonStyle(primaryColor, primaryHover)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = primaryHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = primaryColor)
                }
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <>
          <div
            onClick={() => setShowForm(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              zIndex: 1000,
              cursor: "pointer",
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
            style={{
              position: "fixed",
              top: "5%",
              left: "50%",
              transform: "translateX(-50%)",
              background: "white",
              borderRadius: 8,
              padding: 20,
              width: "90%",
              maxWidth: 600,
              boxShadow: `0 5px 15px ${primaryColor}44`,
              zIndex: 1001,
              maxHeight: "90vh",
              overflowY: "auto",
              color: primaryColor,
              userSelect: "text",
            }}
          >
            <h3 id="form-title" style={{ marginBottom: 15 }}>
              {formId ? "Edit Listing" : "Upload Listing"}
            </h3>
            <form onSubmit={handleSubmitForm}>
              {/* Title */}
              <label
                style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
              >
                Title*:
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  style={{ ...formInputStyle, width: "100%", marginTop: 4 }}
                  maxLength={100}
                />
              </label>

              {/* Description */}
              <label
                style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
              >
                Description*:
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  required
                  style={{
                    ...formInputStyle,
                    width: "100%",
                    marginTop: 4,
                    minHeight: 80,
                    resize: "vertical",
                  }}
                  maxLength={1000}
                />
              </label>

              {/* Link */}
              <label
                style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
              >
                Link (optional):
                <input
                  type="url"
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                  placeholder="https://example.com"
                  style={{ ...formInputStyle, width: "100%", marginTop: 4 }}
                />
              </label>

              {/* Upload Images */}
              <label
                style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
              >
                Upload Images (optional):
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleMediaChange}
                  style={{ display: "block", marginTop: 6 }}
                />
              </label>

              {/* New image previews */}
              {formMediaPreviews.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginBottom: 10,
                    marginTop: 6,
                  }}
                >
                  {formMediaPreviews.map((url, i) => (
                    <div
                      key={i}
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <img
                        src={url}
                        alt={`preview-${i}`}
                        style={{
                          width: 70,
                          height: 70,
                          objectFit: "cover",
                          borderRadius: 6,
                          border: `1px solid ${primaryColor}33`,
                          userSelect: "none",
                        }}
                        draggable={false}
                      />
                      <button
                        type="button"
                        onClick={() => removePreview(i)}
                        aria-label="Remove preview image"
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          background: "#d9534f",
                          borderRadius: "50%",
                          border: "none",
                          color: "white",
                          width: 22,
                          height: 22,
                          cursor: "pointer",
                          fontWeight: "bold",
                          userSelect: "none",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Existing media */}
              {formMediaUrls.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginBottom: 10,
                    marginTop: 6,
                  }}
                >
                  {formMediaUrls.map((url, i) => (
                    <div
                      key={i}
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <img
                        src={url}
                        alt={`existing-media-${i}`}
                        style={{
                          width: 70,
                          height: 70,
                          objectFit: "cover",
                          borderRadius: 6,
                          border: `1px solid ${primaryColor}33`,
                          userSelect: "none",
                        }}
                        draggable={false}
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingMediaUrl(i)}
                        aria-label="Remove existing image"
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          background: "#d9534f",
                          borderRadius: "50%",
                          border: "none",
                          color: "white",
                          width: 22,
                          height: 22,
                          cursor: "pointer",
                          fontWeight: "bold",
                          userSelect: "none",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Company */}
              <label
                style={{ display: "block", marginBottom: 6, fontWeight: 600 }}
              >
                Company*:
                <input
                  type="text"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  required
                  style={{ ...formInputStyle, width: "100%", marginTop: 4 }}
                  maxLength={100}
                />
              </label>

              {/* Category */}
              <label
                style={{ display: "block", marginBottom: 15, fontWeight: 600 }}
              >
                Category*:
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  required
                  style={{
                    ...formInputStyle,
                    width: "100%",
                    marginTop: 4,
                    cursor: "pointer",
                  }}
                >
                  <option value="job">Job</option>
                  <option value="internship">Internship</option>
                </select>
              </label>

              {/* Action buttons */}
              <div
                style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  style={buttonStyle(grayPrimary, grayHover)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = grayHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = grayPrimary)
                  }
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={buttonStyle(primaryColor, primaryHover)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = primaryHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = primaryColor)
                  }
                >
                  {formId ? "Save Changes" : "Upload Listing"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}



