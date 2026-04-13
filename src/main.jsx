import React, { useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import "./styles.css";

const focusStops = [
  { rotation: 0.2, zoom: 5.8 },
  { rotation: -1.36, zoom: 3.35 },
  { rotation: -1.28, zoom: 2.1 },
  { rotation: -1.02, zoom: 4.35 },
  { rotation: -1.34, zoom: 3.05 },
  { rotation: -1.345, zoom: 1.95 },
];

const IMAGE_CREDITS = [
  {
    label: "Western Ghats, Karnataka",
    author: "Shyamal L.",
    url: "https://commons.wikimedia.org/wiki/File:Western_Ghats_Karnataka.jpg",
  },
  {
    label: "IIT Delhi main building",
    author: "TheVyomanaut",
    url: "https://commons.wikimedia.org/wiki/File:IIT_Delhi_Main_Building_Wide.jpg",
  },
];

const announcements = [
  {
    title: "Freshers Meetup",
    date: "Coming soon",
    copy: "QR code, venue, and registration link will appear here.",
  },
  {
    title: "Kannada Movie Night",
    date: "Draft",
    copy: "Poster, timing, and RSVP details can be added from the content file later.",
  },
  {
    title: "Festival Planning",
    date: "Open",
    copy: "Collect volunteers, performers, and food coordination in one place.",
  },
];

const events = [
  {
    title: "Community Evening",
    copy: "A placeholder blog card for photos, a short story, and names of organizers.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Western_Ghats_Karnataka.jpg",
  },
  {
    title: "Campus Gathering",
    copy: "Replace this with your real event album and a small writeup after the first event.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/IIT_Delhi_Main_Building_Wide.jpg",
  },
  {
    title: "Culture Circle",
    copy: "Use this space for poetry, music, food, games, and language sessions.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Western_Ghats_Karnataka.jpg",
  },
];

const people = [
  { name: "Professor Name", role: "Faculty mentor / department", note: "Add after permission or public confirmation." },
  { name: "Student Leader", role: "Institute-level role", note: "Add achievements and verified links." },
  { name: "Alumni Voice", role: "Community supporter", note: "Optional section if alumni want to be included." },
];

const members = [
  { name: "Member Name", role: "Coordinator", link: "LinkedIn / Instagram" },
  { name: "Member Name", role: "Events", link: "LinkedIn / Instagram" },
  { name: "Member Name", role: "Design", link: "LinkedIn / Instagram" },
  { name: "Member Name", role: "Outreach", link: "LinkedIn / Instagram" },
];

const builders = [
  { name: "Your Name", role: "Website builder" },
  { name: "Tech Team Member", role: "Frontend and content" },
  { name: "Community Maintainer", role: "Updates and announcements" },
];

function getJourneyProgress() {
  const journey = document.querySelector(".journey");
  const travel = journey ? journey.offsetHeight - window.innerHeight : 1;
  const start = journey ? journey.offsetTop : 0;
  return THREE.MathUtils.clamp((window.scrollY - start) / travel, 0, 1);
}

function interpolateStops(values, progress) {
  const segment = Math.min(values.length - 2, Math.floor(progress * (values.length - 1)));
  const localProgress = progress * (values.length - 1) - segment;
  return THREE.MathUtils.lerp(values[segment], values[segment + 1], localProgress);
}

function latLonToVector3(lat, lon, radius) {
  const phi = THREE.MathUtils.degToRad(lat);
  const theta = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.cos(theta),
  );
}

function SurfaceFocus({ lat, lon, step, color = "#f2c14e", size = 0.16 }) {
  const marker = React.useRef();
  const position = useMemo(() => latLonToVector3(lat, lon, 1.82), [lat, lon]);
  const quaternion = useMemo(() => {
    const normal = position.clone().normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  }, [position]);

  useFrame(() => {
    const progress = getJourneyProgress();
    const active = 1 - Math.min(1, Math.abs(progress * (focusStops.length - 1) - step));
    const pulse = 1 + Math.sin(Date.now() * 0.006) * 0.08;
    const scale = 0.55 + active * 1.65 * pulse;
    marker.current.scale.setScalar(scale);
    marker.current.children.forEach((child) => {
      if (child.material) {
        child.material.opacity = child.name === "core" ? 0.55 + active * 0.45 : 0.08 + active * 0.62;
      }
    });
  });

  return (
    <group ref={marker} position={position} quaternion={quaternion}>
      <mesh name="halo">
        <ringGeometry args={[size, size * 1.55, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh name="core" position={[0, 0, 0.012]}>
        <circleGeometry args={[size * 0.42, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Globe() {
  const group = React.useRef();
  const earthTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, "#102542");
    gradient.addColorStop(0.5, "#246a73");
    gradient.addColorStop(1, "#0b1d26");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = "#2c8c5b";
    ctx.beginPath();
    ctx.ellipse(720, 270, 84, 138, -0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#75a95b";
    ctx.beginPath();
    ctx.ellipse(685, 235, 95, 120, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e0b65a";
    ctx.beginPath();
    ctx.ellipse(712, 345, 26, 35, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.32)";
    for (let i = 0; i < 18; i += 1) {
      ctx.beginPath();
      ctx.ellipse(120 + i * 54, 90 + (i % 5) * 78, 58, 12, i * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  useFrame((_, delta) => {
    const progress = getJourneyProgress();
    const targetRotation = interpolateStops(focusStops.map((stop) => stop.rotation), progress);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotation, 0.055);
    group.current.rotation.x = Math.sin(Date.now() * 0.0004) * 0.04;
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, 1 + Math.sin(progress * Math.PI) * 0.26, 0.06));
    group.current.rotation.y += delta * 0.035;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.75, 96, 96]} />
        <meshStandardMaterial map={earthTexture} roughness={0.74} metalness={0.05} />
      </mesh>
      <mesh scale={1.03}>
        <sphereGeometry args={[1.75, 96, 96]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
      </mesh>
      <SurfaceFocus lat={22.5} lon={79} step={1} size={0.23} />
      <SurfaceFocus lat={15.3} lon={76.4} step={2} size={0.13} color="#ffda70" />
      <SurfaceFocus lat={28.61} lon={77.2} step={4} size={0.11} />
      <SurfaceFocus lat={28.545} lon={77.192} step={5} size={0.075} color="#fff1a8" />
    </group>
  );
}

function ScrollCamera() {
  useFrame(({ camera }) => {
    const progress = getJourneyProgress();
    const targetZ = interpolateStops(focusStops.map((stop) => stop.zoom), progress);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function JourneyScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ScrollCamera />
      <ambientLight intensity={1.9} />
      <directionalLight position={[4, 2, 5]} intensity={2.5} />
      <Stars radius={80} depth={30} count={2600} factor={4} fade speed={0.8} />
      <Globe />
    </Canvas>
  );
}

function ScrollJourney() {
  return (
    <section className="journey" aria-label="Scroll journey from Earth to IIT Delhi">
      <div className="journey__canvas">
        <JourneyScene />
      </div>
      <p className="sr-only">
        The scroll animation moves from Earth to the Indian subcontinent, then to Karnataka,
        back out across India, then toward Delhi and finally IIT Delhi.
      </p>
    </section>
  );
}

function SectionHeader({ kicker, title, children }) {
  return (
    <div className="section-header">
      <p className="kicker">{kicker}</p>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

function App() {
  return (
    <main>
      <ScrollJourney />

      <section className="culture-section">
        <div className="culture-grid">
          <div>
            <p className="kicker">ನಮ್ಮ ಸಂಗ</p>
            <h1>Kannada Sangha, IIT Delhi</h1>
            <p>
              A space for Kannada voices on campus: language, food, music, festivals,
              friendships, and the small feeling of home that makes Delhi warmer.
            </p>
            <div className="tag-row">
              <span>Kannada</span>
              <span>Karnataka</span>
              <span>Culture</span>
              <span>Campus</span>
            </div>
          </div>
          <figure>
            <img
              src="https://commons.wikimedia.org/wiki/Special:FilePath/Western_Ghats_Karnataka.jpg"
              alt="Forest road in the Western Ghats, Karnataka"
            />
            <figcaption>Western Ghats moodboard for the community section.</figcaption>
          </figure>
        </div>
      </section>

      <section className="section announcements">
        <SectionHeader kicker="ಘೋಷಣೆಗಳು" title="Announcements">
          QR codes, registration links, event posters, and community updates can live here.
        </SectionHeader>
        <div className="card-grid">
          {announcements.map((item) => (
            <article className="notice-card" key={item.title}>
              <span>{item.date}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <div className="qr-placeholder">QR</div>
            </article>
          ))}
        </div>
      </section>

      <section className="section events">
        <SectionHeader kicker="ಕಾರ್ಯಕ್ರಮಗಳು" title="Events">
          Photo-led stories from meetups, festivals, language sessions, and celebrations.
        </SectionHeader>
        <div className="event-strip" aria-label="Scrollable events">
          {events.map((event) => (
            <article className="event-card" key={event.title}>
              <img src={event.image} alt="" />
              <div>
                <h3>{event.title}</h3>
                <p>{event.copy}</p>
                <button type="button">Explore more</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section people">
        <SectionHeader kicker="ನಮ್ಮ ಜನ" title="Our People At IITD">
          Add professors, students, and alumni after checking permissions and public details.
        </SectionHeader>
        <div className="profile-grid">
          {people.map((person) => (
            <article className="profile-card" key={person.name}>
              <div className="avatar">{person.name.charAt(0)}</div>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
              <small>{person.note}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section members">
        <SectionHeader kicker="ಸದಸ್ಯರು" title="Active Members">
          The current year team, their roles, and public profile links.
        </SectionHeader>
        <div className="member-list">
          {members.map((member) => (
            <article key={member.name}>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <a href="#top" aria-label={`${member.name} profile link`}>{member.link}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section builders">
        <SectionHeader kicker="ಕಟ್ಟುವವರು" title="Builders">
          The small crew keeping the website and the community engine alive.
        </SectionHeader>
        <div className="builder-row">
          {builders.map((builder) => (
            <article key={builder.name}>
              <strong>{builder.name}</strong>
              <span>{builder.role}</span>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <img
          src="https://commons.wikimedia.org/wiki/Special:FilePath/IIT_Delhi_Main_Building_Wide.jpg"
          alt="IIT Delhi main building"
        />
        <div>
          <p className="kicker">Join us</p>
          <h2>Join our ever-growing Kannada community.</h2>
          <p>Connect with Kannada Sangha, IIT Delhi for meetups, events, and collaborations.</p>
          <a href="mailto:kannadasangha.iitd@example.com">kannadasangha.iitd@example.com</a>
          <p className="made">Made with love by Kannada Sangha builders.</p>
          <small>© 2026 Kannada Sangha, IIT Delhi. All Rights Reserved.</small>
          <div className="credits">
            {IMAGE_CREDITS.map((credit) => (
              <a href={credit.url} key={credit.url} target="_blank" rel="noreferrer">
                {credit.label}: {credit.author}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
