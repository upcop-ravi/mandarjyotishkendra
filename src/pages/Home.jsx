import React, { useState, useEffect, useMemo } from 'react';
import Header    from '../components/public/Header';
import Hero      from '../components/public/Hero';
import FilterBar from '../components/public/FilterBar';
import BlogFeed  from '../components/public/BlogFeed';
import Footer    from '../components/public/Footer';
import { fetchPublishedPosts } from '../lib/firebase';

// ── Demo posts shown before Firebase is configured ─────────────────
const DEMO_POSTS = [
  {
    id: 'gwalior-winter-drive-2024',
    title: 'Winter Warmth Drive — Gwalior Fort Ground',
    date: { toDate: () => new Date('2024-12-15') },
    location: 'Gwalior Fort Ground, Gwalior, Madhya Pradesh',
    driveType: 'Weekly Drive',
    mealsServed: 450,
    status: 'published',
    description: `## A Cold Morning, Warm Hearts — Gwalior Winter Drive 🍚

On a crisp December morning at the historic Gwalior Fort Ground, our volunteers arrived before sunrise to cook and serve hot meals to hundreds of underprivileged families and daily wage workers gathered under the shade of ancient trees.

### What We Served
Our team prepared large vessels of **hot khichdi** (rice and lentils cooked together) along with **fresh bananas** — a wholesome, nourishing combination that provides both warmth and energy on a cold winter morning. The aroma of freshly cooked food drew families from nearby slum clusters, street workers, and elderly individuals who had nowhere else to turn for a hot meal.

### The Scene on the Ground
Volunteers in winter jackets bent down to serve every person with care and respect. Women holding toddlers, elderly grandmothers wrapped in shawls, young men who work as daily labourers — all stood together in quiet dignity, waiting for their turn. No one was turned away.

A young girl volunteer in her black puffer jacket carefully distributed bananas one by one to each waiting hand, making eye contact and smiling at every person she served. Beside her, fellow volunteers ladled generous portions of khichdi into plates, working seamlessly from the large steel degchis (cooking vessels) that held hundreds of servings.

### Impact
- 🍽️ **450+ meals** served in a single morning
- 👥 **Approx. 200 families** including women, children, and elderly
- 🌡️ Conducted during **peak winter** when hunger is most acute
- 📍 Location: **Gwalior Fort Ground, Gwalior, M.P.**

### A Message from Our Team
*"The greatest act of generosity is not giving from your abundance, but giving until it makes a difference. Today in Gwalior, 450 families went home with full stomachs and warm hearts. We are grateful to every volunteer and donor who made this possible."*

Join us next Sunday — because every pair of hands counts. 🙏`,
    images: [
      { url: '/media/gwalior-real-collage.jpg', altText: 'Real Photo Collage — Gwalior Winter Food Distribution Drive with 100% original volunteer and community faces' },
      { url: '/media/1.jpeg', altText: 'Volunteer distributing bananas to community members at Gwalior Fort Ground' },
      { url: '/media/2.jpeg', altText: 'Close up of hands receiving bananas and hot meals in Gwalior' },
      { url: '/media/3.jpeg', altText: 'Volunteers gathered around large cooking vessel preparing khichdi' },
      { url: '/media/4.jpeg', altText: 'Serving hot khichdi and dal to waiting community members' },
      { url: '/media/5.jpeg', altText: 'Underprivileged families waiting in line for winter meal distribution' },
      { url: '/media/6.jpeg', altText: 'Volunteer serving yellow dal into bowls at Gwalior drive' },
      { url: '/media/7.jpeg', altText: 'Crowd of families gathered under trees at Gwalior Fort Ground' },
      { url: '/media/8.jpeg', altText: 'Volunteers distributing meals with care to elderly and children' },
      { url: '/media/9.jpeg', altText: 'Community members enjoying hot food on a cold morning in Gwalior' },
      { url: '/media/10.jpeg', altText: 'NourishHope team members coordinating food distribution in Gwalior' }
    ],
  },
  {
    id: 'demo-2',
    title: 'Festival Special Meal Drive — Gwalior Old City',
    date: { toDate: () => new Date('2024-08-10') },
    location: 'Lashkar, Gwalior, Madhya Pradesh',
    driveType: 'Festival Drive',
    mealsServed: 580,
    status: 'published',
    description: `On the occasion of the festive season, we partnered with local community leaders in Lashkar, Gwalior to serve **580 wholesome meals** to underprivileged families. Freshly cooked meals, dal, and fruits were distributed to over 200 households across the old city neighbourhoods. This was one of our largest single-day festival drives in Gwalior to date, bringing joy and warmth to the community.`,
    images: [
      { url: '/media/11.jpeg', altText: 'Festival food distribution event in Gwalior Lashkar area' },
      { url: '/media/12.jpeg', altText: 'Volunteers preparing meals for the festival drive in Gwalior' },
      { url: '/media/13.jpeg', altText: 'Community members receiving festival meals in Gwalior' }
    ],
  },
  {
    id: 'demo-3',
    title: 'School Nutrition Program — Govt. School, Morar',
    date: { toDate: () => new Date('2024-07-30') },
    location: 'Morar, Gwalior, Madhya Pradesh',
    driveType: 'School Meal',
    mealsServed: 210,
    status: 'published',
    description: `We launched a weekly nutrition program at a government school in Morar, Gwalior, providing **210 children** with wholesome hot lunches every Friday. Nutritious dal-rice with vegetables is cooked fresh and served with seasonal fruit. A healthy child learns better — our goal is to ensure that no child in Gwalior misses school because they are hungry.`,
    images: [
      { url: '/media/14.jpeg', altText: 'School nutrition meal distribution at Morar, Gwalior' },
      { url: '/media/15.jpeg', altText: 'Children receiving hot nutritious lunches in Gwalior' }
    ],
  },
  {
    id: 'demo-4',
    title: 'Elder Care Initiative — Phoolbagh, Gwalior',
    date: { toDate: () => new Date('2024-07-14') },
    location: 'Phoolbagh Colony, Gwalior, Madhya Pradesh',
    driveType: 'Elder Care',
    mealsServed: 145,
    status: 'published',
    description: `Our elder care team delivered **145 home-cooked meals** directly to the doorsteps of senior citizens living alone in Phoolbagh Colony, Gwalior. Each meal came with a warm conversation — because loneliness hurts as much as hunger. Our volunteers spent time listening to stories from these elders, many of whom had not had a visitor in weeks.`,
    images: [
      { url: '/media/16.jpeg', altText: 'Elder care meal delivery in Phoolbagh Colony Gwalior' },
      { url: '/media/17.jpeg', altText: 'Volunteer delivering meals to elders in Gwalior' }
    ],
  },
  {
    id: 'demo-5',
    title: 'Sunday Community Drive — Railway Station, Gwalior',
    date: { toDate: () => new Date('2024-07-05') },
    location: 'Gwalior Railway Station Area, Gwalior, M.P.',
    driveType: 'Weekly Drive',
    mealsServed: 380,
    status: 'published',
    description: `Every Sunday morning at the Gwalior Railway Station area, hundreds of daily wage workers, migrant labourers, and homeless individuals gather hoping for a warm meal. Our team of 25 volunteers cooked and distributed **380 plates of khichdi and chai** to those in need. The station ground has become a symbol of our commitment — rain or shine, we show up.`,
    images: [
      { url: '/media/18.jpeg', altText: 'Food distribution drive at Gwalior Railway Station area' },
      { url: '/media/19.jpeg', altText: 'Volunteers serving hot food to daily wage workers in Gwalior' }
    ],
  },
  {
    id: 'demo-6',
    title: 'Monthly Mega Drive — Birla Nagar, Gwalior',
    date: { toDate: () => new Date('2024-06-16') },
    location: 'Birla Nagar, Gwalior, Madhya Pradesh',
    driveType: 'Special Event',
    mealsServed: 620,
    status: 'published',
    description: `June's Monthly Mega Drive at Birla Nagar in Gwalior was our biggest yet — **620 meals** served in a single session to families from surrounding slum areas and construction site workers. We partnered with 3 local colleges whose NSS units sent student volunteers who helped cook, serve, and clean up. Together we proved that when a community unites, no one goes hungry.`,
    images: [
      { url: '/media/20.jpeg', altText: 'Monthly mega drive in Birla Nagar Gwalior with volunteer team' },
      { url: '/media/1.jpeg', altText: 'Student volunteers and NourishHope team serving meals in Gwalior' }
    ],
  },
];



export default function Home() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '', month: '', location: '', driveType: 'All Types',
  });

  // Fetch posts on mount — with 8s timeout fallback to demo data
  useEffect(() => {
    const timeout = setTimeout(() => {
      // If Firebase hasn't responded in 8s, show demo posts
      setPosts(DEMO_POSTS);
      setLoading(false);
    }, 8000);

    fetchPublishedPosts()
      .then(data => {
        clearTimeout(timeout);
        // If Firebase is configured but empty, still show demos
        setPosts(data.length > 0 ? data : DEMO_POSTS);
      })
      .catch(() => {
        clearTimeout(timeout);
        // Firebase not configured — show demo posts
        setPosts(DEMO_POSTS);
      })
      .finally(() => setLoading(false));

    return () => clearTimeout(timeout);
  }, []);


  // Client-side filtering
  const filtered = useMemo(() => {
    return posts.filter(post => {
      const { search, month, location, driveType } = filters;
      const lc = (s) => (s ?? '').toLowerCase();

      // Full-text search
      if (search && ![post.title, post.location, post.description, post.driveType]
            .some(f => lc(f).includes(lc(search)))) return false;

      // Month filter
      if (month) {
        const postDate = post.date?.toDate ? post.date.toDate() : new Date(post.date);
        if (isNaN(postDate) || String(postDate.getMonth() + 1) !== month) return false;
      }

      // Location filter
      if (location && !lc(post.location).includes(lc(location))) return false;

      // Drive type filter
      if (driveType && driveType !== 'All Types' && post.driveType !== driveType) return false;

      return true;
    });
  }, [posts, filters]);

  return (
    <>
      {/* SEO */}
      <title>NourishHope Foundation — Serving Daily Meals to Those in Need</title>
      <meta name="description"
        content="NourishHope Foundation distributes nutritious meals to underprivileged communities. Follow our charity drive stories, donate, and make a difference." />

      <Header />
      <Hero />

      {/* Blog section */}
      <main id="stories" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <span className="inline-block bg-primary-100 text-primary-700 text-sm font-semibold
                           px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            Photo Stories
          </span>
          <h2 className="font-heading font-black text-4xl sm:text-5xl text-charcoal-800 mb-4">
            Our Charity Drive Updates
          </h2>
          <p className="text-charcoal-500 max-w-xl mx-auto text-lg leading-relaxed">
            Real stories from the ground — every drive, every meal, every smile we've shared
            with our community.
          </p>
        </div>

        {/* Filter bar */}
        <div className="mb-10">
          <FilterBar onFilter={setFilters} />
        </div>

        {/* Feed */}
        <BlogFeed posts={filtered} loading={loading} />
      </main>

      <Footer />
    </>
  );
}
