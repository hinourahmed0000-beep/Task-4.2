

import React, { useEffect, useMemo, useState } from 'react';

const KEY = 'acl-marketplace-v3';

const categories = [
  'textbooks',
  'electronics',
  'furniture',
  'clothing',
  'other',
];

const conditions = ['new', 'like-new', 'used', 'worn'];

const currentUser = {
  name: 'You',
  email: 'you@example.com',
};

const photo = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=82`;

const seed = [
  {
    id: 'm1',
    title: 'Calculus II textbook',
    category: 'textbooks',
    condition: 'used',
    price: 320,
    description:
      'Second-year calculus textbook, complete with all chapters. A few highlighted sections and notes in pencil, but no missing or torn pages. You can inspect it before deciding.',
    status: 'active',
    owner: 'you',
    seller: 'You',
    sellerEmail: currentUser.email,
    pickup: 'GUC student area, near the main cafeteria',
    photos: [
      photo('photo-1544947950-fa07a98d237f'),
      photo('photo-1494438639946-1ebd1d20bf85'),
    ],
    emoji: '📚',
  },
  {
    id: 'm2',
    title: 'Student desk lamp',
    category: 'furniture',
    condition: 'like-new',
    price: 240,
    description:
      'Compact study lamp with warm light, adjustable position and a USB power cable. Used for one semester only. The cable and light both work.',
    status: 'active',
    owner: 'other',
    seller: 'Mariam',
    sellerEmail: 'mariam.seller@example.com',
    pickup: 'GUC library entrance, weekdays after 1 PM',
    photos: [photo('photo-1555475384-a0aefc775412')],
    emoji: '💡',
  },
  {
    id: 'm3',
    title: 'Bluetooth headphones',
    category: 'electronics',
    condition: 'used',
    price: 650,
    description:
      'Wireless over-ear headphones in good working condition. Includes the original carrying pouch and charging cable. The battery lasts about six hours. A few cosmetic scratches near one hinge. You can test sound and pairing before buying.',
    status: 'active',
    owner: 'other',
    seller: 'Omar',
    sellerEmail: 'omar.seller@example.com',
    pickup: 'Arrange a meetup at GUC Gate 3',
    photos: [
      photo('photo-1599955051125-571f47e04316'),
      photo('photo-1505740420928-5e560c06d30e'),
      photo('photo-1546435770-a3e426bf472b'),
    ],
    emoji: '🎧',
  },
  {
    id: 'm4',
    title: 'Engineering lab coat',
    category: 'clothing',
    condition: 'new',
    price: 200,
    description:
      'White engineering lab coat, medium size, bought for a lab but never worn. Still clean and folded. Please check your required size before arranging pickup.',
    status: 'active',
    owner: 'you',
    seller: 'You',
    sellerEmail: currentUser.email,
    pickup: 'Meet at GUC main entrance, mornings',
    photos: [photo('photo-1542058186993-286fdce0b580')],
    emoji: '🥼',
  },
  {
    id: 'm5',
    title: 'Drawing tablet',
    category: 'electronics',
    condition: 'like-new',
    price: 1450,
    description:
      'Small USB drawing tablet with pressure-sensitive pen and protective sleeve. Fully functional. Works with common creative software after installing the manufacturer driver. You can try the pen before buying.',
    status: 'active',
    owner: 'other',
    seller: 'Nour',
    sellerEmail: 'nour.seller@example.com',
    pickup: 'GUC design building reception',
    photos: [photo('photo-1671087709820-274fdd9ac67a')],
    emoji: '✏️',
  },
  {
    id: 'm6',
    title: 'Used storage shelf',
    category: 'furniture',
    condition: 'worn',
    price: 390,
    description:
      'Light wooden storage shelf. Stable and usable, with visible scratches from moving rooms. Suitable for books, stationery and small storage boxes. Buyer should arrange transport.',
    status: 'active',
    owner: 'other',
    seller: 'Youssef',
    sellerEmail: 'youssef.seller@example.com',
    pickup: 'Public pickup point near GUC, by arrangement',
    photos: [
      photo('photo-1692195321701-1a454c79ab02'),
      photo('photo-1758279746549-d24f3784879d'),
    ],
    emoji: '🗄️',
  },
  {
    id: 'm7',
    title: 'MATH 201 workbook',
    category: 'textbooks',
    condition: 'used',
    price: 140,
    description:
      'Workbook with practice problems, solutions and lecture notes. All pages present and readable. Some answers are written in pencil. Already sold to another student.',
    status: 'sold',
    owner: 'you',
    seller: 'You',
    sellerEmail: currentUser.email,
    pickup: 'GUC campus',
    photos: [photo('photo-1544947950-fa07a98d237f')],
    emoji: '📖',
  },
  {
    id: 'm8',
    title: 'Sketching kit',
    category: 'other',
    condition: 'like-new',
    price: 180,
    description:
      'Charcoal pencils, graphite pencils, blending tools and an A5 sketch pad. Lightly used, with plenty of material remaining for design practice.',
    status: 'active',
    owner: 'other',
    seller: 'Salma',
    sellerEmail: 'salma.seller@example.com',
    pickup: 'Outside the GUC architecture studios',
    photos: [
      photo('photo-1758521232691-613561977b6a'),
      photo('photo-1771366629879-8b3128ee62ca'),
    ],
    emoji: '🎨',
  },
];

const emptyForm = {
  title: '',
  price: '',
  category: '',
  condition: '',
  description: '',
  pickup: '',
  status: 'active',
  photos: [],
};

const cap = (value = '') =>
  value === 'like-new'
    ? 'Like new'
    : value.replace(/\b\w/g, (letter) => letter.toUpperCase());

const money = (value) =>
  `EGP ${Number(value).toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })}`;

function saved() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(value) ? value : seed;
  } catch {
    return seed;
  }
}

function findError(form) {
  if (!form.title.trim()) return 'Please enter an item title.';

  if (
    String(form.price).trim() === '' ||
    !Number.isFinite(Number(form.price)) ||
    Number(form.price) < 0
  ) {
    return 'Please enter a price of zero or more.';
  }

  if (!categories.includes(form.category)) {
    return 'Please choose a category.';
  }

  if (!conditions.includes(form.condition)) {
    return 'Please choose the item condition.';
  }

  if (!['active', 'sold'].includes(form.status)) {
    return 'Please choose a valid status.';
  }

  return '';
}

function ListingImage({ src, alt, emoji, className = '' }) {
  const [broken, setBroken] = useState(false);

  useEffect(() => setBroken(false), [src]);

  return src && !broken ? (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setBroken(true)}
    />
  ) : (
    <span className="item-emoji" role="img" aria-label="Photo unavailable">
      {emoji || '📦'}
    </span>
  );
}

/* Resize uploaded pictures so they take less browser storage. */
function preparePhoto(file) {
  return new Promise((resolve, reject) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      reject(new Error('Choose a JPG, PNG or WebP picture.'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('Choose a picture smaller than 10 MB.'));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Could not read this picture.'));

    reader.onload = () => {
      const image = new Image();

      image.onerror = () =>
        reject(new Error('Could not open this picture. Try another one.'));

      image.onload = () => {
        try {
          const scale = Math.min(1, 900 / Math.max(image.width, image.height));
          const canvas = document.createElement('canvas');

          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));

          const context = canvas.getContext('2d');
          if (!context) throw new Error('Picture processing failed.');

          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          resolve(canvas.toDataURL('image/jpeg', 0.75));
        } catch {
          reject(new Error('Could not process this picture. Try another one.'));
        }
      };

      image.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });
}

export default function App() {
  const [items, setItems] = useState(saved);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [condition, setCondition] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editor, setEditor] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [notice, setNotice] = useState('');

  useEffect(() => setActivePhoto(0), [selected]);

  useEffect(() => {
    if (!selected && !editor) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKey(event) {
      if (event.key === 'Escape' && !uploading) {
        setSelected(null);
        setEditor(null);
      }
    }

    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [selected, editor, uploading]);

  const listing = useMemo(() => {
    const search = query.trim().toLowerCase();

    const result = items.filter((item) => {
      const matchesSearch =
        `${item.title} ${item.category} ${item.description} ${item.pickup || ''}`
          .toLowerCase()
          .includes(search);

      return (
        matchesSearch &&
        (category === 'all' || item.category === category) &&
        (condition === 'all' || item.condition === condition) &&
        (maxPrice === '' || item.price <= Number(maxPrice)) &&
        (!availableOnly || item.status !== 'sold')
      );
    });

    if (sort === 'low') result.sort((a, b) => a.price - b.price);
    if (sort === 'high') result.sort((a, b) => b.price - a.price);
    if (sort === 'title') result.sort((a, b) => a.title.localeCompare(b.title));

    return result;
  }, [items, query, category, condition, maxPrice, availableOnly, sort]);

  const filterCount =
    Number(category !== 'all') +
    Number(condition !== 'all') +
    Number(maxPrice !== '') +
    Number(availableOnly);

  function clearFilters() {
    setQuery('');
    setCategory('all');
    setCondition('all');
    setMaxPrice('');
    setAvailableOnly(false);
    setSort('featured');
  }

  function updateField(field, value) {
    setEditor((previous) =>
      previous
        ? { ...previous, form: { ...previous.form, [field]: value } }
        : previous
    );
    setError('');
  }

  function startEdit(item) {
    if (item && item.owner !== 'you') return;

    setSelected(null);
    setError('');

    setEditor({
      id: item?.id || null,
      form: item
        ? {
            title: item.title,
            price: String(item.price),
            category: item.category,
            condition: item.condition,
            description: item.description || '',
            pickup: item.pickup || '',
            status: item.status,
            photos: [...(item.photos || [])],
          }
        : { ...emptyForm, photos: [] },
    });
  }

  function closeEditor() {
    if (!uploading) setEditor(null);
  }

  async function uploadPhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || !editor || uploading) return;

    if (editor.form.photos.length >= 4) {
      setError('You can add up to four pictures. Remove one to add another.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const picture = await preparePhoto(file);

      setEditor((previous) =>
        previous
          ? {
              ...previous,
              form: {
                ...previous.form,
                photos: [...previous.form.photos, picture],
              },
            }
          : previous
      );
    } catch (problem) {
      setError(problem.message);
    } finally {
      setUploading(false);
    }
  }

  function saveItems(nextItems) {
    try {
      localStorage.setItem(KEY, JSON.stringify(nextItems));
      setItems(nextItems);
      return true;
    } catch {
      setError(
        'Browser storage is full. Remove a picture and try saving again.'
      );
      return false;
    }
  }

  function submit(event) {
    event.preventDefault();

    if (!editor || uploading) return;

    const form = editor.form;
    const message = findError(form);

    if (message) {
      setError(message);
      return;
    }

    const original = editor.id
      ? items.find((item) => item.id === editor.id)
      : null;

    if (editor.id && (!original || original.owner !== 'you')) {
      setError('You can only edit your own listings.');
      return;
    }

    const nextItem = {
      ...original,
      id: original?.id || `m-${Date.now()}`,
      title: form.title.trim(),
      price: Number(form.price),
      category: form.category,
      condition: form.condition,
      description: form.description.trim(),
      pickup: form.pickup.trim(),
      status: original ? form.status : 'active',
      photos: form.photos,
      emoji: original?.emoji || '📦',
      owner: 'you',
      seller: currentUser.name,
      sellerEmail: currentUser.email,
    };

    const nextItems = original
      ? items.map((item) => (item.id === original.id ? nextItem : item))
      : [nextItem, ...items];

    if (!saveItems(nextItems)) return;

    clearFilters();
    setNotice(original ? 'Changes saved.' : 'Your item has been published.');
    setEditor(null);
    setSelected(null);

    document.getElementById('discover')?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  function reset() {
    if (!saveItems(seed)) {
      setNotice('Could not reset the demo. Browser storage is unavailable.');
      return;
    }

    clearFilters();
    setSelected(null);
    setEditor(null);
    setNotice('Example items restored.');
  }

  const selectedItem = items.find((item) => item.id === selected);

  return (
    <div className="market-app">
      <style>{`
        .instock { display: none; }

        .filter-toggle, .clear-filters {
          padding: 10px 14px;
          border: 1px solid #bdcbbb;
          border-radius: 9px;
          background: white;
          color: #192d29;
          font-weight: 600;
        }

        .filter-toggle[aria-expanded="true"] {
          background: #e5eddf;
        }

        .filter-panel {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          padding: 18px;
          margin-bottom: 18px;
          border: 1px solid #cad5cb;
          border-radius: 12px;
          background: white;
        }

        .filter-panel > label {
          display: flex;
          flex-direction: column;
          gap: 7px;
          font-size: 13px;
          font-weight: 600;
        }

        .filter-panel select, .filter-panel input[type="number"] {
          width: 100%;
          padding: 10px;
          border: 1px solid #b9c9bb;
          border-radius: 8px;
          background: white;
          color: #192d29;
        }

        .filter-panel .availability-check {
          flex-direction: row;
          align-items: center;
          align-self: center;
          gap: 10px;
        }

        .availability-check input {
          width: 18px;
          height: 18px;
          accent-color: #175c48;
        }

        .results-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }

        .results-bar p { margin: 0; font-size: 13px; }

        .upload-section {
          grid-column: 1 / -1;
          padding: 16px;
          border: 1px dashed #a9bda7;
          border-radius: 10px;
          background: #f6f8f3;
        }

        .upload-section h3 { margin: 0 0 6px; font-size: 15px; }
        .upload-section p { font-size: 12px; color: #52645a; }
        .upload-section input[type="file"] {
          width: 100%;
          padding: 8px;
          font-size: 12px;
        }

        .upload-previews {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-top: 12px;
        }

        .upload-preview { margin: 0; min-width: 0; }

        .upload-preview img {
          display: block;
          width: 100%;
          height: 85px;
          border-radius: 8px;
          object-fit: cover;
        }

        .upload-preview figcaption {
          font-size: 11px;
          margin-top: 5px;
        }

        .remove-photo {
          width: 100%;
          margin-top: 5px;
          padding: 5px;
          border: 1px solid #d7bab2;
          border-radius: 6px;
          background: white;
          color: #9a3020;
          font-size: 11px;
        }

        button:disabled { opacity: .6; cursor: wait; }

        @media (max-width: 600px) {
          .filter-panel { grid-template-columns: 1fr; }
          .upload-previews { grid-template-columns: repeat(2, 1fr); }
          .discover-right { flex-wrap: wrap; }
        }
      `}</style>

      <div className="utility">
        <span>Campus Exchange</span>
        <span>From students, for students • All prices in EGP</span>
      </div>

      <header className="navigation">
        <button
          className="brand"
          onClick={() => {
            clearFilters();
            setSelected(null);
          }}
        >
          <span className="brand-icon">✳</span>
          CAMPUS<span className="brand-alt">exchange</span>
        </button>

        <nav aria-label="Main navigation">
          <a href="#discover">Browse items</a>
          <button onClick={() => setCategory('textbooks')}>Textbooks</button>
          <button onClick={() => setCategory('electronics')}>Electronics</button>
        </nav>

        <div className="nav-actions">
          <span className="usercircle" aria-label="Your account">Y</span>
          <button className="sell-cta" onClick={() => startEdit(null)}>
            + Sell an item
          </button>
        </div>
      </header>

      <main>
        <section className="promo">
          <div className="promo-copy">
            <span className="tag">THE CAMPUS MARKETPLACE</span>
            <h1>
              Everything you need,
              <br />
              <i>right around campus.</i>
            </h1>
            <p>Find affordable items or give your own a second home.</p>
            <button
              onClick={() =>
                document.getElementById('discover')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }
            >
              Explore listings ↗
            </button>
          </div>

          <div className="promo-art" aria-hidden="true">
            <span>📚</span>
            <span>💡</span>
            <span>🎧</span>
            <span>🛋️</span>
          </div>
        </section>

        <section className="discovery" id="discover">
          <div className="discover-top">
            <div>
              <p className="section-kicker">FIND YOUR NEXT CAMPUS ESSENTIAL</p>
              <h2>Find something good.</h2>
              <p>Search, compare prices and choose what suits you.</p>
            </div>

            <div className="discover-right">
              <label className="search">
                <span aria-hidden="true">⌕</span>
                <input
                  aria-label="Search listings"
                  placeholder="Search items or pickup location"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>

              <label className="sort">
                <span>Sort</span>
                <select
                  aria-label="Sort listings"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                  <option value="title">Name: A–Z</option>
                </select>
              </label>

              <button
                className="filter-toggle"
                aria-expanded={showFilters}
                aria-controls="listing-filters"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters {filterCount > 0 ? `(${filterCount})` : ''}
              </button>
            </div>
          </div>

          <div className="category-row" aria-label="Item categories">
            {['all', ...categories].map((value) => (
              <button
                key={value}
                className={category === value ? 'on' : ''}
                aria-pressed={category === value}
                onClick={() => setCategory(value)}
              >
                {value === 'all' ? 'All items' : cap(value)}
              </button>
            ))}
          </div>

          {showFilters && (
            <div className="filter-panel" id="listing-filters">
              <label>
                Maximum price (EGP)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="No limit"
                  value={maxPrice}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value === '' || Number(value) >= 0) {
                      setMaxPrice(value);
                    }
                  }}
                />
              </label>

              <label>
                Condition
                <select
                  value={condition}
                  onChange={(event) => setCondition(event.target.value)}
                >
                  <option value="all">Any condition</option>
                  {conditions.map((value) => (
                    <option key={value} value={value}>
                      {cap(value)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="availability-check">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(event) => setAvailableOnly(event.target.checked)}
                />
                Hide sold items
              </label>
            </div>
          )}

          <div className="results-bar">
            <p role="status">
              {listing.length} {listing.length === 1 ? 'item' : 'items'} found
            </p>

            {(filterCount > 0 || query || sort !== 'featured') && (
              <button className="clear-filters" onClick={clearFilters}>
                Clear search & filters
              </button>
            )}
          </div>

          {notice && (
            <p className="notice" role="status">
              {notice}
              <button aria-label="Dismiss notification" onClick={() => setNotice('')}>
                ×
              </button>
            </p>
          )}

          <div className="listing-grid">
            {listing.map((item) => (
              <article className="product" key={item.id}>
                <button
                  className="photo"
                  aria-label={`View ${item.title}`}
                  onClick={() => setSelected(item.id)}
                >
                  <span className="stamp">{cap(item.condition)}</span>
                  <ListingImage
                    src={item.photos?.[0]}
                    alt={item.title}
                    emoji={item.emoji}
                    className="listing-img"
                  />
                  <span className="category-caption">{cap(item.category)}</span>
                </button>

                <div className="prod-details">
                  <div className="prod-topline">
                    <span className="muted">{cap(item.category)}</span>
                    {item.status === 'sold' && (
                      <span className="soldstatus">SOLD</span>
                    )}
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.description || 'Open this item for more details.'}</p>

                  <div className="costline">
                    <strong>{money(item.price)}</strong>
                    <span>{cap(item.condition)}</span>
                  </div>

                  <button
                    className="details-button"
                    onClick={() => setSelected(item.id)}
                  >
                    View item <span>↗</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {listing.length === 0 && (
            <div className="noresults">
              <h3>No matching items</h3>
              <p>Try another search or increase your maximum price.</p>
              <button className="clear-filters" onClick={clearFilters}>
                Show all items
              </button>
            </div>
          )}
        </section>

        <footer>
          <strong>CAMPUS exchange</strong>
          <span>From students, for students.</span>
          <button onClick={reset}>Reset demo</button>
        </footer>
      </main>

      {selectedItem && (
        <div
          className="overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <section
            className="detail-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
          >
            <button
              className="close"
              aria-label="Close item details"
              autoFocus
              onClick={() => setSelected(null)}
            >
              ×
            </button>

            <div className="detail-visual">
              <ListingImage
                src={selectedItem.photos?.[activePhoto]}
                alt={selectedItem.title}
                emoji={selectedItem.emoji}
                className="detail-img"
              />
            </div>

            {selectedItem.photos?.length > 1 && (
              <div className="detail-thumbs" aria-label="Item pictures">
                {selectedItem.photos.map((src, index) => (
                  <button
                    key={index}
                    className={activePhoto === index ? 'thumb active' : 'thumb'}
                    aria-label={`Show picture ${index + 1}`}
                    aria-pressed={activePhoto === index}
                    onClick={() => setActivePhoto(index)}
                  >
                    <ListingImage
                      src={src}
                      alt=""
                      emoji={selectedItem.emoji}
                      className="thumb-img"
                    />
                  </button>
                ))}
              </div>
            )}

            <p className="section-kicker">
              {cap(selectedItem.category)} · {cap(selectedItem.condition)}
            </p>

            <h2 id="detail-title">{selectedItem.title}</h2>
            <h3>{money(selectedItem.price)}</h3>

            {selectedItem.status === 'sold' && (
              <p className="soldstatus">This item has been sold.</p>
            )}

            <p className="item-description">
              {selectedItem.description || 'No description supplied.'}
            </p>

            <div className="detail-meta">
              <p>
                <strong>Pickup</strong>
                <br />
                {selectedItem.pickup || 'Arrange directly with seller'}
              </p>
              <p>
                <strong>Seller</strong>
                <br />
                {selectedItem.seller}
              </p>
            </div>

            {selectedItem.owner === 'you' ? (
              <button
                className="sell-cta"
                onClick={() => startEdit(selectedItem)}
              >
                Edit your listing
              </button>
            ) : selectedItem.status !== 'sold' ? (
              <a
                className="sell-cta contact-seller"
                href={`mailto:${selectedItem.sellerEmail}?subject=${encodeURIComponent(
                  `Campus Exchange: ${selectedItem.title}`
                )}&body=${encodeURIComponent(
                  `Hi ${selectedItem.seller},\n\nI'm interested in "${selectedItem.title}" (${money(
                    selectedItem.price
                  )}). Is it still available?\n\n`
                )}`}
              >
                ✉ Contact seller
              </a>
            ) : null}
          </section>
        </div>
      )}

      {editor && (
        <div
          className="overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEditor();
          }}
        >
          <section
            className="sell-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sell-title"
          >
            <div className="modal-head">
              <div>
                <p className="section-kicker">CAMPUS EXCHANGE</p>
                <h2 id="sell-title">
                  {editor.id ? 'Edit your listing' : 'Sell an item'}
                </h2>
                <p>Add pictures and details so buyers know what to expect.</p>
              </div>

              <button
                className="close"
                aria-label="Close form"
                disabled={uploading}
                onClick={closeEditor}
              >
                ×
              </button>
            </div>

            <form onSubmit={submit} noValidate>
              <div className="field-grid">
                <label>
                  <span>Item title *</span>
                  <input
                    autoFocus
                    required
                    value={editor.form.title}
                    onChange={(event) => updateField('title', event.target.value)}
                    placeholder="What are you selling?"
                  />
                </label>

                <label>
                  <span>Price (EGP) *</span>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={editor.form.price}
                    onChange={(event) => updateField('price', event.target.value)}
                    placeholder="e.g. 250"
                  />
                </label>

                <label>
                  <span>Category *</span>
                  <select
                    required
                    value={editor.form.category}
                    onChange={(event) =>
                      updateField('category', event.target.value)
                    }
                  >
                    <option value="">Choose a category</option>
                    {categories.map((value) => (
                      <option key={value} value={value}>
                        {cap(value)}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Condition *</span>
                  <select
                    required
                    value={editor.form.condition}
                    onChange={(event) =>
                      updateField('condition', event.target.value)
                    }
                  >
                    <option value="">Choose a condition</option>
                    {conditions.map((value) => (
                      <option key={value} value={value}>
                        {cap(value)}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="upload-section">
                  <h3>Item pictures</h3>
                  <p id="photo-help">
                    Add up to four JPG, PNG or WebP pictures. The first picture
                    appears on your listing.
                  </p>

                  <label htmlFor="item-photo">Choose a picture</label>
                  <input
                    id="item-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    aria-describedby="photo-help"
                    disabled={uploading || editor.form.photos.length >= 4}
                    onChange={uploadPhoto}
                  />

                  {uploading && <p role="status">Preparing your picture…</p>}

                  <div className="upload-previews">
                    {editor.form.photos.map((src, index) => (
                      <figure className="upload-preview" key={index}>
                        <img src={src} alt={`Item preview ${index + 1}`} />
                        <figcaption>
                          {index === 0 ? 'Cover picture' : `Picture ${index + 1}`}
                        </figcaption>
                        <button
                          type="button"
                          className="remove-photo"
                          disabled={uploading}
                          aria-label={`Remove picture ${index + 1}`}
                          onClick={() =>
                            updateField(
                              'photos',
                              editor.form.photos.filter((_, i) => i !== index)
                            )
                          }
                        >
                          Remove
                        </button>
                      </figure>
                    ))}
                  </div>
                </div>

                <label className="wide">
                  <span>Description</span>
                  <textarea
                    rows="4"
                    value={editor.form.description}
                    onChange={(event) =>
                      updateField('description', event.target.value)
                    }
                    placeholder="Include useful details, size or any damage."
                  />
                </label>

                <label className="wide">
                  <span>Pickup / meetup location</span>
                  <input
                    value={editor.form.pickup}
                    onChange={(event) =>
                      updateField('pickup', event.target.value)
                    }
                    placeholder="e.g. GUC library entrance"
                  />
                </label>

                <label className="wide">
                  <span>Seller contact email</span>
                  <input
                    value={currentUser.email}
                    readOnly
                    className="readonly-input"
                  />
                  <small className="email-helper">
                    Filled automatically from your demo account.
                  </small>
                </label>

                {editor.id && (
                  <label>
                    <span>Availability</span>
                    <select
                      value={editor.form.status}
                      onChange={(event) =>
                        updateField('status', event.target.value)
                      }
                    >
                      <option value="active">Available</option>
                      <option value="sold">Sold</option>
                    </select>
                  </label>
                )}
              </div>

              {error && (
                <p className="alert" role="alert">
                  {error}
                </p>
              )}

              <div className="modal-foot">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={closeEditor}
                >
                  Cancel
                </button>
                <button className="sell-cta" type="submit" disabled={uploading}>
                  {uploading
                    ? 'Preparing picture…'
                    : editor.id
                      ? 'Save changes'
                      : 'Publish item'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}