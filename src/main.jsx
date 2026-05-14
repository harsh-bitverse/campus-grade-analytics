import React, { useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";
import "./styles.css";

const EARTH_TEXTURES = {
  surface: "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
  normal: "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg",
  specular: "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg",
  clouds: "https://threejs.org/examples/textures/planets/earth_clouds_1024.png",
};

const focusStops = [
  { lat: 0, lon: -12, rotation: 2.65, tilt: 0.02, zoom: 5.8 },
  { lat: 22.5, lon: 79, rotation: 3.33, tilt: 0.38, zoom: 3.55 },
  { lat: 15.3, lon: 76.4, rotation: 3.38, tilt: 0.27, zoom: 2.65 },
  { lat: 22.5, lon: 79, rotation: 3.33, tilt: 0.34, zoom: 4.35 },
  { lat: 28.61, lon: 77.2, rotation: 3.36, tilt: 0.49, zoom: 3.05 },
  { lat: 28.545, lon: 77.192, rotation: 3.36, tilt: 0.5, zoom: 1.72 },
];

const HIGHLIGHT_REGIONS = new Set(["Karnataka", "Delhi"]);

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
  {
    label: "Earth texture set",
    author: "Three.js examples",
    url: "https://github.com/mrdoob/three.js/tree/dev/examples/textures/planets",
  },
  {
    label: "India district boundary GeoJSON",
    author: "udit-001/india-maps-data",
    url: "https://github.com/udit-001/india-maps-data",
  },
  {
    label: "IIT Delhi campus map",
    author: "OpenStreetMap contributors",
    url: "https://www.openstreetmap.org/",
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
  { name: "Coordinator Name", role: "Coordinator", link: "LinkedIn / Instagram" },
  { name: "Events Lead Name", role: "Events", link: "LinkedIn / Instagram" },
  { name: "Design Lead Name", role: "Design", link: "LinkedIn / Instagram" },
  { name: "Outreach Lead Name", role: "Outreach", link: "LinkedIn / Instagram" },
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
    radius * Math.cos(phi) * Math.cos(theta),
    radius * Math.sin(phi),
    -radius * Math.cos(phi) * Math.sin(theta),
  );
}

function getGeometryRings(geometry) {
  if (!geometry) {
    return [];
  }

  if (geometry.type === "Polygon") {
    return geometry.coordinates;
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.flat();
  }

  return [];
}

function simplifyRing(ring, targetPoints) {
  const step = Math.max(1, Math.ceil(ring.length / targetPoints));
  const simplified = ring.filter((_, index) => index % step === 0);
  const first = ring[0];
  const last = simplified[simplified.length - 1];

  if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
    simplified.push(first);
  }

  return simplified;
}

function BoundaryLine({ ring, color, opacity, radius = 1.872, targetPoints = 42 }) {
  const geometry = useMemo(() => {
    const points = simplifyRing(ring, targetPoints).map(([lon, lat]) => latLonToVector3(lat, lon, radius));
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius, ring, targetPoints]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </line>
  );
}

function IndiaBoundaries() {
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/data/india.geojson")
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setMapData(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMapData({ features: [] });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const rings = useMemo(() => {
    if (!mapData?.features) {
      return [];
    }

    const allIndia = [];
    const highlighted = [];

    mapData.features.forEach((feature) => {
      const stateName = feature.properties?.st_nm;
      const stateRings = getGeometryRings(feature.geometry).filter((ring) => ring.length > 8);

      if (HIGHLIGHT_REGIONS.has(stateName)) {
        highlighted.push(...stateRings.map((ring) => ({ ring, stateName })));
        return;
      }

      stateRings.forEach((ring) => {
        allIndia.push({ ring, stateName });
      });
    });

    return {
      allIndia: allIndia.filter((_, index) => index % 2 === 0).slice(0, 380),
      highlighted,
    };
  }, [mapData]);

  if (!rings?.allIndia) {
    return null;
  }

  return (
    <group>
      {rings.allIndia.map(({ ring }, index) => (
        <BoundaryLine
          key={`india-${index}`}
          ring={ring}
          color="#d9e5ce"
          opacity={0.14}
          targetPoints={22}
        />
      ))}
      {rings.highlighted.map(({ ring, stateName }, index) => (
        <BoundaryLine
          key={`${stateName}-${index}`}
          ring={ring}
          color={stateName === "Karnataka" ? "#ffdc6f" : "#fff1a8"}
          opacity={stateName === "Karnataka" ? 0.92 : 0.82}
          radius={1.884}
          targetPoints={stateName === "Karnataka" ? 90 : 52}
        />
      ))}
    </group>
  );
}

function RouteArc({ from, to, step }) {
  const line = React.useRef();
  const points = useMemo(() => {
    const start = latLonToVector3(from.lat, from.lon, 1.86).normalize();
    const end = latLonToVector3(to.lat, to.lon, 1.86).normalize();
    return Array.from({ length: 34 }, (_, index) => {
      const point = start.clone().lerp(end, index / 33).normalize();
      return point.multiplyScalar(1.865);
    });
  }, [from, to]);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useFrame(() => {
    const progress = getJourneyProgress() * (focusStops.length - 1);
    const active = 1 - Math.min(1, Math.abs(progress - step - 0.5));
    line.current.material.opacity = 0.08 + active * 0.74;
  });

  return (
    <line ref={line} geometry={geometry}>
      <lineBasicMaterial color="#f2c14e" transparent opacity={0.18} depthWrite={false} />
    </line>
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
    const scale = 0.38 + active * 0.95 * pulse;
    marker.current.scale.setScalar(scale);
    marker.current.children.forEach((child) => {
      if (child.material) {
        child.material.opacity = child.name === "core" ? 0.42 + active * 0.58 : 0.06 + active * 0.52;
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
  const clouds = React.useRef();
  const [earthMap, normalMap, specularMap, cloudMap] = useTexture([
    EARTH_TEXTURES.surface,
    EARTH_TEXTURES.normal,
    EARTH_TEXTURES.specular,
    EARTH_TEXTURES.clouds,
  ]);

  useMemo(() => {
    earthMap.colorSpace = THREE.SRGBColorSpace;
    cloudMap.colorSpace = THREE.SRGBColorSpace;
    [earthMap, normalMap, specularMap, cloudMap].forEach((texture) => {
      texture.anisotropy = 8;
    });
  }, [earthMap, normalMap, specularMap, cloudMap]);

  useFrame((_, delta) => {
    const progress = getJourneyProgress();
    const targetRotation = interpolateStops(focusStops.map((stop) => stop.rotation), progress);
    const targetTilt = interpolateStops(focusStops.map((stop) => stop.tilt), progress);
    group.current.rotation.y = targetRotation;
    group.current.rotation.x = targetTilt;
    group.current.scale.setScalar(1 + Math.sin(progress * Math.PI) * 0.26);
    clouds.current.rotation.y += delta * 0.025;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.75, 96, 96]} />
        <meshPhongMaterial
          map={earthMap}
          normalMap={normalMap}
          normalScale={[0.32, 0.32]}
          specularMap={specularMap}
          specular="#6f8cb8"
          shininess={10}
        />
      </mesh>
      <mesh ref={clouds} scale={1.012}>
        <sphereGeometry args={[1.75, 96, 96]} />
        <meshPhongMaterial
          map={cloudMap}
          transparent
          opacity={0.42}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh scale={1.03}>
        <sphereGeometry args={[1.75, 96, 96]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
      </mesh>
      <IndiaBoundaries />
      <RouteArc from={focusStops[1]} to={focusStops[2]} step={1} />
      <RouteArc from={focusStops[2]} to={focusStops[3]} step={2} />
      <RouteArc from={focusStops[3]} to={focusStops[4]} step={3} />
      <RouteArc from={focusStops[4]} to={focusStops[5]} step={4} />
      <SurfaceFocus lat={focusStops[1].lat} lon={focusStops[1].lon} step={1} size={0.16} />
      <SurfaceFocus lat={focusStops[2].lat} lon={focusStops[2].lon} step={2} size={0.085} color="#ffda70" />
      <SurfaceFocus lat={focusStops[4].lat} lon={focusStops[4].lon} step={4} size={0.072} />
      <SurfaceFocus lat={focusStops[5].lat} lon={focusStops[5].lon} step={5} size={0.046} color="#fff1a8" />
    </group>
  );
}

function ScrollCamera() {
  useFrame(({ camera }) => {
    const progress = getJourneyProgress();
    const targetZ = interpolateStops(focusStops.map((stop) => stop.zoom), progress);
    camera.position.z = targetZ;
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
  const campusMap = React.useRef();
  const campusLayout = React.useRef();

  useEffect(() => {
    function syncProgress() {
      const progress = getJourneyProgress();
      const layoutProgress = Math.min(1, Math.max(0, (progress - 0.948) / 0.038));
      const showMap = progress > 0.875 && progress <= 0.948;
      const showLayout = progress > 0.948;

      if (campusMap.current) {
        campusMap.current.classList.toggle("campus-map--visible", showMap);
        campusMap.current.setAttribute("aria-hidden", String(!showMap));
      }

      if (campusLayout.current) {
        campusLayout.current.classList.toggle("campus-layout--visible", showLayout);
        campusLayout.current.setAttribute("aria-hidden", String(!showLayout));
        campusLayout.current.style.setProperty("--layout-width", `min(100vw, ${72 + layoutProgress * 28}vw)`);
        campusLayout.current.style.setProperty("--layout-height", `${32 + layoutProgress * 24}vh`);
        campusLayout.current.style.setProperty("--layout-top", `${Math.max(0, 42 - layoutProgress * 42)}vh`);
        campusLayout.current.style.setProperty("--layout-y", `${36 * (1 - layoutProgress)}px`);
        campusLayout.current.style.setProperty("--layout-scale", 0.96 + layoutProgress * 0.04);
        campusLayout.current.style.setProperty("--layout-radius", `${8 * (1 - layoutProgress)}px`);
      }
    }

    let frameId;
    function tick() {
      syncProgress();
      frameId = window.requestAnimationFrame(tick);
    }

    tick();
    window.addEventListener("scroll", syncProgress, { passive: true });
    window.addEventListener("resize", syncProgress);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", syncProgress);
      window.removeEventListener("resize", syncProgress);
    };
  }, []);

  return (
    <section className="journey" aria-label="Scroll journey from Earth to IIT Delhi">
      <div className="journey__canvas">
        <JourneyScene />
        <div ref={campusMap} className="campus-map" aria-hidden="true">
          <iframe
            title="IIT Delhi campus map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=77.1805%2C28.5388%2C77.2038%2C28.5519&layer=mapnik&marker=28.5454%2C77.1926"
          />
          <a href="https://www.openstreetmap.org/?mlat=28.5454&mlon=77.1926#map=16/28.5454/77.1926" target="_blank" rel="noreferrer">
            OpenStreetMap
          </a>
        </div>
        <figure
          ref={campusLayout}
          className="campus-layout"
          aria-hidden="true"
        >
          <img src="/images/iitd-campus-transition.jpeg" alt="IIT Delhi campus" />
          <figcaption>IIT Delhi</figcaption>
        </figure>
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
        <div className="forest-veil" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="culture-grid">
          <div>
            <p className="kicker">ನಮ್ಮ ಸಂಗ</p>
            <h1>Kannada Sangha, IIT Delhi</h1>
            <p>
              From the green folds of Karnataka to the red-brick rhythm of IIT Delhi,
              this is a home for Kannada voices, food, music, festivals, stories, and
              the friendships that make campus feel warmer.
            </p>
            <p>
              The first visual language can borrow from the Western Ghats: deep leaves,
              rain-dark stone, golden festival light, and Kannada letterforms moving like
              a forest trail.
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
