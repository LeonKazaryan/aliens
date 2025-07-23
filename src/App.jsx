import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import gsap from 'gsap'
import './App.css'

// 3D UFO Component
function UFO({ position, speed }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    meshRef.current.position.x += speed * 0.01
    meshRef.current.rotation.y += 0.01
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1
    
    // Reset position when UFO goes off screen
    if (meshRef.current.position.x > 20) {
      meshRef.current.position.x = -20
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* UFO Body */}
      <mesh>
        <cylinderGeometry args={[1, 1.5, 0.3, 8]} />
        <meshStandardMaterial color="#4a90e2" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* UFO Dome */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#7bb3f0" transparent opacity={0.7} />
      </mesh>
      {/* UFO Lights */}
      <mesh position={[0, -0.1, 0]}>
        <ringGeometry args={[0.5, 1.2, 8]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

// Animated Counter Component
function AnimatedCounter({ value }) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    const duration = 2000
    const startValue = displayValue
    const endValue = value
    
    gsap.to({}, {
      duration: duration / 1000,
      onUpdate: function() {
        const currentValue = Math.floor(startValue + (endValue - startValue) * this.progress())
        setDisplayValue(currentValue)
      }
    })
  }, [value])

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="counter-number"
    >
      {displayValue.toLocaleString()}
    </motion.span>
  )
}

// Animated Logo Component
function AnimatedLogo() {
  return (
    <motion.div 
      className="animated-logo"
      animate={{ 
        rotate: [0, 360],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <div className="logo-earth">🌍</div>
      <motion.div 
        className="logo-tentacle"
        animate={{ 
          rotate: [0, 45, -45, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        🦑
      </motion.div>
    </motion.div>
  )
}

// Timeline Item Component
function TimelineItem({ year, title, description, delay }) {
  return (
    <motion.div 
      className="timeline-item"
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
    >
      <div className="timeline-marker">
        <motion.div 
          className="timeline-dot"
          animate={{ 
            scale: [1, 1.3, 1],
            boxShadow: [
              "0 0 0 0 rgba(0, 255, 136, 0.4)",
              "0 0 0 20px rgba(0, 255, 136, 0)",
              "0 0 0 0 rgba(0, 255, 136, 0)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div className="timeline-content">
        <h3 className="timeline-year">{year}</h3>
        <h4 className="timeline-title">{title}</h4>
        <p className="timeline-description">{description}</p>
      </div>
    </motion.div>
  )
}

// Console Log Component
function ConsoleLog({ message, delay }) {
  return (
    <motion.div 
      className="console-log"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <span className="console-time">[{new Date().toLocaleTimeString()}]</span>
      <span className="console-message">{message}</span>
    </motion.div>
  )
}

// Sci-Fi Interface Component
function SciFiInterface() {
  const [consoleLogs, setConsoleLogs] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const consoleRef = useRef()

  const systemLogs = [
    "Локация: Планета Земля — ошибка логики обнаружена",
    "Сканирую: пробка на МКАДе засчитана как достопримечательность",
    "Анализ: местные существа называют это 'рабочим днём'",
    "ВНИМАНИЕ: обнаружена странная субстанция под названием 'кофе'",
    "Сканирование: 99% населения смотрит в прямоугольные устройства",
    "ОШИБКА: не удалось понять логику 'понедельника'",
    "Анализ завершён: планета пригодна для туризма (с осторожностью)",
    "СИСТЕМА: загружаю карту достопримечательностей...",
    "ПРОЦЕСС: инициализация телепортации...",
    "СТАТУС: готов к массовому вторжению (экскурсии)"
  ]

  const addConsoleLog = (message) => {
    const newLog = {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString()
    }
    setConsoleLogs(prev => [...prev.slice(-8), newLog]) // Keep only last 9 logs
  }

  const startScanning = () => {
    setIsScanning(true)
    addConsoleLog("ИНИЦИАЛИЗАЦИЯ: начало сканирования планеты Земля...")
    
    // Add logs with delays
    systemLogs.forEach((log, index) => {
      setTimeout(() => {
        addConsoleLog(log)
      }, (index + 1) * 800)
    })

    // Scroll to next section after scanning
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight * 3,
        behavior: 'smooth'
      })
      setIsScanning(false)
    }, systemLogs.length * 800 + 2000)
  }

  return (
    <section className="scifi-section">
      <div className="scifi-background">
        <div className="grid-overlay"></div>
        <div className="scan-lines"></div>
        <div className="noise-overlay"></div>
      </div>

      <div className="scifi-container">
        <div className="scifi-main">
          <motion.h2 
            className="scifi-title"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            Сканируй грязный шар
          </motion.h2>

          <motion.div 
            className="hologram-container"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="hologram-earth">
              <motion.div 
                className="earth-sphere"
                animate={{ 
                  rotate: [0, 360],
                  scale: isScanning ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                🌍
              </motion.div>
              
              {isScanning && (
                <motion.div 
                  className="scan-ring"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 2, opacity: [1, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}
            </div>
          </motion.div>

          <motion.div
            className="scan-button-container"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="scan-button"
              onClick={startScanning}
              disabled={isScanning}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0, 150, 255, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              animate={isScanning ? {
                boxShadow: [
                  "0 0 20px rgba(0, 150, 255, 0.5)",
                  "0 0 40px rgba(0, 150, 255, 0.8)",
                  "0 0 20px rgba(0, 150, 255, 0.5)"
                ]
              } : {}}
              transition={{ 
                boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              🪐 НАЧАТЬ АНАЛИЗ ПЛАНЕТЫ
            </motion.button>
          </motion.div>
        </div>

        <motion.div 
          className="console-panel"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          viewport={{ once: true }}
        >
          <div className="console-header">
            <div className="console-title">СИСТЕМНЫЕ ЛОГИ</div>
            <div className="console-status">
              <span className="status-dot"></span>
              АКТИВЕН
            </div>
          </div>
          
          <div className="console-content" ref={consoleRef}>
            {consoleLogs.map((log) => (
              <ConsoleLog 
                key={log.id}
                message={log.message}
                delay={0}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Tourist Spot Component
function TouristSpot({ spot, onSpotClick }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`tourist-spot ${spot.category}`}
      style={{
        left: `${spot.x}%`,
        top: `${spot.y}%`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSpotClick(spot)}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="spot-marker">
        <span className="spot-icon">{spot.icon}</span>
        <motion.div 
          className="spot-pulse"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      
      {isHovered && (
        <motion.div 
          className="spot-tooltip"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <h4>{spot.name}</h4>
          <p>{spot.description}</p>
          <span className="spot-category">{spot.category}</span>
        </motion.div>
      )}
    </motion.div>
  )
}

// Interactive Map Component
function InteractiveMap() {
  const [selectedFilters, setSelectedFilters] = useState(['food', 'noise', 'threat'])
  const [showNotification, setShowNotification] = useState(false)
  const [notificationSpot, setNotificationSpot] = useState(null)

  const touristSpots = [
    {
      id: 1,
      name: "Яма с танцующими людьми",
      description: "Глубокое подземное сооружение, где местные существа ритмично двигаются под громкие звуки. Возможно, это ритуал призывания.",
      icon: "🕳️",
      category: "noise",
      x: 20,
      y: 30
    },
    {
      id: 2,
      name: "Магазин с бесконечной очередью",
      description: "Место, где существа стоят в длинной линии, чтобы получить товары. Похоже на религиозный обряд терпения.",
      icon: "🛒",
      category: "threat",
      x: 35,
      y: 25
    },
    {
      id: 3,
      name: "Гора, которую обходят — и не спрашивают",
      description: "Высокое сооружение, которое местные избегают. Возможно, там живут древние боги или опасные существа.",
      icon: "🏢",
      category: "threat",
      x: 50,
      y: 40
    },
    {
      id: 4,
      name: "Стеклянные ловушки (музеи)",
      description: "Прозрачные здания, где существа добровольно заходят и смотрят на старые предметы. Странный способ времяпрепровождения.",
      icon: "🏛️",
      category: "noise",
      x: 65,
      y: 35
    },
    {
      id: 5,
      name: "Хранилище горячих жидкостей",
      description: "Места, где подают обжигающие напитки. Местные называют это 'кофейни'. Очень популярно.",
      icon: "☕",
      category: "food",
      x: 25,
      y: 60
    },
    {
      id: 6,
      name: "Поля с круглыми объектами",
      description: "Большие открытые пространства, где существа бегают за круглым предметом. Спортивный ритуал.",
      icon: "⚽",
      category: "noise",
      x: 70,
      y: 70
    },
    {
      id: 7,
      name: "Подземные туннели",
      description: "Сеть подземных проходов, где существа передвигаются в металлических коробках. Эффективная система транспорта.",
      icon: "🚇",
      category: "threat",
      x: 45,
      y: 55
    },
    {
      id: 8,
      name: "Храмы потребления",
      description: "Огромные здания, где существа поклоняются товарам. Называют 'торговые центры'.",
      icon: "🏬",
      category: "food",
      x: 80,
      y: 45
    }
  ]

  const filters = [
    { id: 'food', label: '🍕 Пищевые места', icon: '🍕' },
    { id: 'noise', label: '🔊 Странные шумы', icon: '🔊' },
    { id: 'threat', label: '⚠️ Потенциальная угроза', icon: '⚠️' }
  ]

  const toggleFilter = (filterId) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    )
  }

  const handleSpotClick = (spot) => {
    setNotificationSpot(spot)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const filteredSpots = touristSpots.filter(spot => selectedFilters.includes(spot.category))

  return (
    <section className="map-section">
      <div className="map-background">
        <div className="space-stars"></div>
        <div className="map-glow"></div>
      </div>

      <div className="map-container">
        <motion.h2 
          className="map-title"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          Карта достопримечательностей Земли
        </motion.h2>

        <motion.div 
          className="map-filters"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {filters.map((filter) => (
            <motion.label
              key={filter.id}
              className="filter-item"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="checkbox"
                checked={selectedFilters.includes(filter.id)}
                onChange={() => toggleFilter(filter.id)}
                className="filter-checkbox"
              />
              <span className="filter-icon">{filter.icon}</span>
              <span className="filter-label">{filter.label}</span>
            </motion.label>
          ))}
        </motion.div>

        <motion.div 
          className="map-area"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="earth-map">
            <div className="map-continents">
              {/* Simplified continent shapes */}
              <div className="continent north-america"></div>
              <div className="continent south-america"></div>
              <div className="continent europe"></div>
              <div className="continent africa"></div>
              <div className="continent asia"></div>
              <div className="continent australia"></div>
            </div>
            
            {filteredSpots.map((spot) => (
              <TouristSpot 
                key={spot.id}
                spot={spot}
                onSpotClick={handleSpotClick}
              />
            ))}
          </div>
        </motion.div>

        {showNotification && (
          <motion.div 
            className="notification"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <div className="notification-content">
              <span className="notification-icon">✅</span>
              <div className="notification-text">
                <h4>Тур добавлен в протокол</h4>
                <p>{notificationSpot?.name}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

// About Section Component
function AboutSection() {
  const { scrollYProgress } = useScroll()
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const timelineY = useTransform(scrollYProgress, [0, 1], [0, 100])

  const scrollToReviews = () => {
    // Scroll to reviews section (we'll add this later)
    window.scrollTo({
      top: window.innerHeight * 2,
      behavior: 'smooth'
    })
  }

  return (
    <section className="about-section">
      <div className="about-background">
        <div className="ancient-pattern"></div>
      </div>
      
      <div className="about-container">
        <motion.div 
          className="about-header"
          style={{ y: logoY }}
        >
          <AnimatedLogo />
          <motion.h2 
            className="about-title"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            Мы телепортировали первого туриста ещё до постройки пирамид
          </motion.h2>
        </motion.div>

        <motion.div 
          className="timeline-container"
          style={{ y: timelineY }}
        >
          <div className="timeline-line"></div>
          
          <TimelineItem 
            year="-4000 до н.э."
            title="Первая экскурсия к шумерам"
            description="Наши предки открыли первый офис в Месопотамии. Туристы были в восторге от местной кухни и архитектуры."
            delay={0.2}
          />
          
          <TimelineItem 
            year="1776"
            title="Массовый тур в Америку"
            description="Маскировка — воздушные шары. Никто не заметил, что это были наши корабли. Гениально!"
            delay={0.4}
          />
          
          <TimelineItem 
            year="2023"
            title="Телепортация отменена из-за ковида"
            description="Даже инопланетяне болели. Пришлось закрыть порталы на карантин. Скучно было!"
            delay={0.6}
          />
        </motion.div>

        <motion.div 
          className="about-actions"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="scrolls-button"
            onClick={scrollToReviews}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 15px 35px rgba(255, 193, 7, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            📜 Читать древний свиток с отзывами
          </motion.button>
        </motion.div>

        <motion.div 
          className="partners-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="partners-title">Наши партнёры по галактике</h3>
          <div className="partners-grid">
            <motion.a 
              href="#" 
              className="partner-card"
              whileHover={{ 
                scale: 1.05,
                y: -10,
                boxShadow: "0 20px 40px rgba(0, 255, 136, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="partner-icon">🌌</div>
              <h4>Галактический Booking</h4>
              <p>Лучшие цены на отели в 47 галактиках</p>
            </motion.a>
            
            <motion.a 
              href="#" 
              className="partner-card"
              whileHover={{ 
                scale: 1.05,
                y: -10,
                boxShadow: "0 20px 40px rgba(255, 107, 107, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="partner-icon">🪐</div>
              <h4>MetaPluto</h4>
              <p>Виртуальные туры по Солнечной системе</p>
            </motion.a>
            
            <motion.a 
              href="#" 
              className="partner-card"
              whileHover={{ 
                scale: 1.05,
                y: -10,
                boxShadow: "0 20px 40px rgba(78, 205, 196, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="partner-icon">🦎</div>
              <h4>TripReptiloid</h4>
              <p>Эксклюзивные туры для рептилоидов</p>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function App() {
  const [teleportCount, setTeleportCount] = useState(15420)
  const containerRef = useRef()
  const { scrollYProgress } = useScroll()
  
  // Parallax effect
  const y = useTransform(scrollYProgress, [0, 1], [0, -300])
  
  // Increment counter on mount and periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTeleportCount(prev => prev + Math.floor(Math.random() * 5) + 1)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const scrollToForm = () => {
    // Smooth scroll to form (we'll add this later)
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  return (
    <>
      <div className="hero-container" ref={containerRef}>
        {/* Animated Background */}
        <div className="space-background">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <UFO position={[-10, 2, 0]} speed={1} />
            <UFO position={[5, -1, 0]} speed={-0.8} />
            <UFO position={[-5, 3, 0]} speed={1.2} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.1} />
          </Canvas>
        </div>

        {/* Floating Earth */}
        <motion.div 
          className="floating-earth"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 360]
          }}
          transition={{ 
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 60, repeat: Infinity, ease: "linear" }
          }}
        >
          🌍
        </motion.div>

        {/* Main Content */}
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hero-text"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="hero-title"
            >
              Покажи людям, кто тут{' '}
              <motion.span
                className="dominant-species"
                animate={{ 
                  color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
                  textShadow: [
                    '0 0 20px #ff6b6b',
                    '0 0 20px #4ecdc4', 
                    '0 0 20px #45b7d1',
                    '0 0 20px #96ceb4',
                    '0 0 20px #feca57'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                доминирующий вид!
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="hero-subtitle"
            >
              Туры на планету, где воздух всё ещё бесплатный{' '}
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                (иногда)
              </motion.span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="cta-section"
            >
              <motion.button
                className="cta-button"
                onClick={scrollToForm}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0, 255, 136, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 10px 30px rgba(0, 255, 136, 0.3)",
                    "0 20px 40px rgba(0, 255, 136, 0.6)",
                    "0 10px 30px rgba(0, 255, 136, 0.3)"
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                🚀 Телепортируйся сейчас
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="counter-section"
            >
              <p className="counter-text">
                Уже телепортировались: <AnimatedCounter value={teleportCount} /> существ
              </p>
              <motion.div
                className="counter-bar"
                initial={{ width: 0 }}
                animate={{ width: `${(teleportCount % 1000) / 10}%` }}
                transition={{ duration: 1, delay: 2 }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="floating-ufo"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          🛸
        </motion.div>

        <motion.div
          className="floating-alien"
          animate={{ 
            x: [0, -80, 0],
            y: [0, 30, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        >
          👽
        </motion.div>
      </div>

      {/* About Section */}
      <AboutSection />

      {/* Sci-Fi Interface Section */}
      <SciFiInterface />

      {/* Interactive Map Section */}
      <InteractiveMap />
    </>
  )
}

export default App
