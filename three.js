// Three.js ve GLTFLoader kütüphanelerini import et
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Temel değişkenler
let scene, camera, renderer, model, brightStars, controls; // 3D sahne, kamera, renderer, model ve controls için temel değişkenler
let spotLights = []; // Spot ışıkları tutacak dizi
let clock = new THREE.Clock(); // Animasyonlar için zaman takibi
let isLoading = true; // Yükleme durumunu takip et

/**
 * Ana başlatma fonksiyonu - tüm 3D sahne bileşenlerini oluşturur
 */
function init() {
    // Kullanıcı arayüzü elemanlarını oluştur
    createUIElements();
    
    // Yeni bir 3D sahne oluştur
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Koyu arka plan ekleyin

    
    // Kamera ayarları
    const container = document.getElementById('3d-container');
    // Perspektif kamera oluştur (görüş açısı, en/boy oranı, yakın düzlem, uzak düzlem)
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    
    // Kamerayı heykelden daha uzağa konumlandır (orijinal: 0, 4, 7)
    camera.position.set(0, 25, 50); // Y ve Z değerlerini artırarak kamerayı uzaklaştır
    camera.lookAt(0, 0, 0); // Kamerayı sahne merkezine odakla

    // Renderer (görüntüleyici) ayarları
    renderer = new THREE.WebGLRenderer({ antialias: true }); // Kenar yumuşatma ile renderer oluştur
    renderer.setSize(container.clientWidth, container.clientHeight); // Renderer boyutunu konteyner boyutuna ayarla
    renderer.setPixelRatio(window.devicePixelRatio); // Ekran piksel oranını kullan (Retina ekranlar için)
    renderer.shadowMap.enabled = true; // Gölge haritalarını etkinleştir
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Yumuşak gölgeler için PCF gölge haritası kullan
    renderer.physicallyCorrectLights = true; // Fiziksel olarak doğru ışıklandırma
    renderer.outputEncoding = THREE.sRGBEncoding; // sRGB renk uzayını kullan
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Film benzeri ton eşleme
    renderer.toneMappingExposure = 1.5; // Ton eşleme pozlaması artırıldı (1.2 → 1.5)
    container.appendChild(renderer.domElement); // Renderer'ı konteyner içine ekle
    
    // OrbitControls'u başlat ve sadece yatay döndürmeye izin ver
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false; // Panning'i devre dışı bırak
    controls.screenSpacePanning = false;
    controls.enableZoom = false; // Zoom'u devre dışı bırak
    // controls.minDistance = 20;
    // controls.maxDistance = 100;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableRotate = true;
    controls.minPolarAngle = Math.PI / 2; // Sadece yatay düzlemde döndürmeye izin ver
    controls.maxPolarAngle = Math.PI / 2;

    // Yıldızlı arka plan oluştur
    createStarryBackground();
    
    // Zemin oluştur
    createFloor();

    // Ortam ışığı ekle - sahnenin hiçbir yerin tamamen karanlık olmamasını sağlar
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4); // Ortam ışık yoğunluğu artırıldı (0.3 → 0.4)
    scene.add(ambientLight);

    // Geliştirilmiş ışıklandırma sistemi oluştur
    createEnhancedLighting();

    // Heykel modelini yükle
    createStatue();

    // Pencere boyutu değiştiğinde sahnedeki öğeleri yeniden boyutlandır
    window.addEventListener('resize', onWindowResize);

    // Animasyon döngüsünü başlat
    animate();
    
}

/**
 * Kullanıcı arayüzü elemanlarını oluştur
 * Basitleştirilmiş UI, sadece gerekli elemanları içerir
 */
function createUIElements() {
    // Body (sayfa gövdesi) stilini ayarla
    const body = document.body;
    body.style.margin = '0';
    body.style.padding = '0';
    body.style.overflow = 'scroll';
    body.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

    const htmlStyle = document.createElement('style');
htmlStyle.textContent = `
    html {
        margin: 0;
        padding: 0;
        height: 100%;
        box-sizing: border-box;
    }
`;
document.head.appendChild(htmlStyle);
    
// Ana konteyner oluştur - tüm sayfayı kaplayan
const mainContainer = document.createElement('div');
mainContainer.style.width = '100vw';
mainContainer.style.height = '100vh';
mainContainer.style.display = 'flex';
mainContainer.style.flexDirection = 'column';
mainContainer.style.position = 'relative';
mainContainer.style.overflow = 'hidden'; // Taşmayı önle
body.appendChild(mainContainer);

// 3D içeriği gösterecek ana konteyner
const container = document.createElement('div');
container.id = '3d-container';
container.style.flex = '1';
container.style.width = '100%';
container.style.height = '100%'; // Tam yüksekliği kapla
container.style.position = 'relative';
container.style.overflow = 'hidden'; // Taşmayı önle
mainContainer.appendChild(container);
    
}

/**
 * Yuvarlak zemin düzlemi oluştur - heykelin durduğu yüzey
 */
function createFloor() {
    // Yuvarlak bir düzlem geometrisi oluştur (çap: 40 birim, segment sayısı: 32)
    const floorGeometry = new THREE.CircleGeometry(20, 32); // 20 birim yarıçap, 32 segment
    
    // Zemin için standart malzeme - yarı mat, hafif metalik görünüm
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x303030, // Koyu gri renk
        metalness: 0.1,  // Düşük metalizm - hafif yansıma
        roughness: 0.8,  // Yüksek pürüzlülük - mat görünüm
        envMapIntensity: 1.0 // Çevre haritası yoğunluğu
    });
    
    // Zemin mesh'i oluştur (geometri + malzeme)
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // 90 derece döndür (yatay olması için)
    floor.position.y = -2; // Konumu y ekseninde aşağı kaydır
    floor.receiveShadow = true; // Gölgeleri alacak şekilde ayarla
    scene.add(floor); // Sahneye ekle
}

/**
 * Geliştirilmiş ışıklandırma sistemini oluştur
 * Daha yukarıdan gelen ışık ile dramatik efekt
 */
function createEnhancedLighting() {
    // Önceki ışıkları temizle (eğer varsa)
    scene.children.forEach(child => {
        if (child instanceof THREE.Light || child instanceof THREE.SpotLightHelper) {
            scene.remove(child);
        }
    });
    spotLights = []; // Spot ışık dizisini sıfırla
    
    // Ortam ışığını artır
    const ambientLight = new THREE.AmbientLight(0x202020, 0.25);
    scene.add(ambientLight);
    
    // 75 derecelik açıyla yerleştirilmiş güçlü spot ışık (önceki 60 yerine)
    const angle = Math.PI / 2.5; // Yaklaşık 75 derece radyan cinsinden
    const distance = 20; // Işık kaynağı mesafesi artırıldı (15 → 20)
    const spotLight = new THREE.SpotLight(0xffffff, 350); // Işık yoğunluğu artırıldı
    
    // 75 derecelik açı için pozisyon (daha yukarıdan aşağıya doğru)
    spotLight.position.set(
        Math.sin(angle) * distance * 0.2, // X pozisyonu daha da azaltıldı
        Math.cos(angle) * distance * 1.5, // Y pozisyonu (yükseklik) çok daha yüksek
        0 // Direkt önden bakış için Z pozisyonu sıfır
    );
    
    // Spot ışık parametreleri
    spotLight.angle = 0.5; // Işık hüzmesi genişliği artırıldı
    spotLight.penumbra = 0.35; // Yumuşak kenar gölge - daha yumuşak
    spotLight.decay = 1.5;
    spotLight.distance = 70; // Maksimum ışık mesafesi artırıldı
    spotLight.castShadow = true;
    
    // Geliştirilmiş gölge kalitesi ayarları
    spotLight.shadow.mapSize.width = 4096;
    spotLight.shadow.mapSize.height = 4096;
    spotLight.shadow.camera.near = 5;
    spotLight.shadow.camera.far = 70;
    spotLight.shadow.bias = -0.0001;
    spotLight.shadow.normalBias = 0.01;
    spotLight.shadow.radius = 2;
    
    // Işığın hedefe bakmasını sağla
    const target = new THREE.Object3D();
    target.position.set(0, -1, 0); // Heykelin altını hedefle
    scene.add(target);
    spotLight.target = target;
    
    // Ana ışığı sahneye ekle
    scene.add(spotLight);
    spotLights.push({ light: spotLight, helper: new THREE.SpotLightHelper(spotLight, 0xffffff) });
    
    // İkinci ana ışık ekle - karşı taraftan ve daha yukarıdan
    const spotLight2 = new THREE.SpotLight(0xffeedd, 180);
    spotLight2.position.set(-Math.sin(angle) * distance * 0.3, Math.cos(angle) * distance * 1.3, distance * 0.2);
    spotLight2.angle = 0.5;
    spotLight2.penumbra = 0.4;
    spotLight2.decay = 1.8;
    spotLight2.distance = 60;
    spotLight2.castShadow = true;
    spotLight2.shadow.mapSize.width = 2048;
    spotLight2.shadow.mapSize.height = 2048;
    spotLight2.shadow.camera.near = 5;
    spotLight2.shadow.camera.far = 60;
    spotLight2.shadow.bias = -0.0001;
    spotLight2.shadow.normalBias = 0.01;
    spotLight2.shadow.radius = 2;
    spotLight2.target = target;
    scene.add(spotLight2);
    spotLights.push({ light: spotLight2, helper: new THREE.SpotLightHelper(spotLight2, 0xffffff) });
    
    // Dolgu ışığı ekle - gölgeleri yumuşatmak için (daha yukarıdan)
    const fillLight = new THREE.SpotLight(0xaaccff, 40);
    fillLight.position.set(-distance * 0.4, distance * 1.2, -distance * 0.2); // Daha yukarı pozisyon
    fillLight.angle = 0.6;
    fillLight.penumbra = 0.5;
    fillLight.decay = 2;
    fillLight.distance = 50; // Mesafe artırıldı
    fillLight.castShadow = true;
    fillLight.shadow.mapSize.width = 1024;
    fillLight.shadow.mapSize.height = 1024;
    fillLight.shadow.camera.near = 5;
    fillLight.shadow.camera.far = 50;
    fillLight.shadow.bias = -0.0001;
    fillLight.target = target;
    
    // Dolgu ışığını sahneye ekle
    scene.add(fillLight);
    spotLights.push({ light: fillLight, helper: new THREE.SpotLightHelper(fillLight, 0xffffff) });
    
    // YENİ: Tam yukarıdan (90 derece) gelen spot ışık ekle
    const topLight = new THREE.SpotLight(0xffffff, 150); // Beyaz ışık, orta yoğunlukta
    topLight.position.set(0, distance * 2, 0); // Tam yukarıdan (x:0, y:yüksek, z:0)
    topLight.angle = 0.4; // Dar ışık açısı
    topLight.penumbra = 0.3; // Yumuşak kenar gölgesi
    topLight.decay = 1.6;
    topLight.distance = 60;
    topLight.castShadow = true;
    topLight.shadow.mapSize.width = 2048;
    topLight.shadow.mapSize.height = 2048;
    topLight.shadow.camera.near = 5;
    topLight.shadow.camera.far = 60;
    topLight.shadow.bias = -0.0001;
    topLight.shadow.normalBias = 0.01;
    topLight.shadow.radius = 2;
    topLight.target = target; // Aynı hedefi kullan (heykel merkezi)
    scene.add(topLight);
    spotLights.push({ light: topLight, helper: new THREE.SpotLightHelper(topLight, 0xffffff) });
    
    // Z ekseninden (90 derece açıyla) gelen yeni spot ışık tanımı
    const sideLight = new THREE.SpotLight(0xffcf00, 150); // Güçlü sarı/amber ışık (renk: 0xffcf00, yoğunluk: 100)
    
    // Işığın sahnedeki konumu ayarlanıyor (x: -10, y: 10 yükseklik, z: uzaklık)
    sideLight.position.set(-10, 45, distance * 1.5); // Z ekseninden gelen ışık için uygun konum
    
    sideLight.angle = 0.5; // Işığın yayılma açısı (radyan cinsinden) – 0 ile π/2 arası
    sideLight.penumbra = 0.7; // Yumuşak kenar oranı (0: keskin kenar, 1: tamamen yumuşak)
    sideLight.decay = 1; // Işık yoğunluğunun mesafeyle ne kadar azaldığını belirler
    sideLight.distance = 50; // Işığın etkili olduğu maksimum mesafe
    
    sideLight.castShadow = true; // Işığın gölge oluşturmasına izin verilir
    
    // Gölge haritasının çözünürlüğü artırılır (detaylı ve kaliteli gölgeler için)
    sideLight.shadow.mapSize.width = 2048; // Gölge haritası genişliği
    sideLight.shadow.mapSize.height = 2048; // Gölge haritası yüksekliği
    
    // Gölge kamerasının yakın ve uzak mesafeleri ayarlanır
    sideLight.shadow.camera.near = 5; // Gölge oluşturma için minimum mesafe
    sideLight.shadow.camera.far = 60; // Gölge oluşturma için maksimum mesafe
    
    sideLight.shadow.bias = -0.0001; // Gölge kusurlarını (shadow acne) azaltmak için küçük bir sapma
    sideLight.shadow.normalBias = 0.01; // Yüzeye göre gölge pozisyonunu hafif kaydırma (komutlama hatalarını düzeltir)
    sideLight.shadow.radius = 2; // Gölge yumuşaklığını kontrol eder (ışığın kenar bulanıklığı)
    
    // Işığın hedefi belirleniyor (genelde odak noktası olan bir nesne)
    sideLight.target = target; // Heykelin merkezi gibi bir hedef
    
    // Işık sahneye ekleniyor
    scene.add(sideLight);
    
    // Spot ışık helper'ı oluşturuluyor ve diziye ekleniyor (görsel olarak ışığın yönünü ve kapsama alanını gösterir)
    spotLights.push({ 
      light: sideLight, 
      helper: new THREE.SpotLightHelper(sideLight, 0xffffff) // Beyaz renkli yardımcı çizim
    });
}

/**
 * Zemin ışık efekti için degrade doku oluşturma
 * @param {boolean} focused - Daha odaklı parlaklık efekti için
 * @returns {THREE.CanvasTexture} Oluşturulan degrade doku
 */
function createGradientTexture(focused = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Daha yukarıdan gelen ışık için daha odaklı degrade
    const gradient = ctx.createRadialGradient(
        128, 128, 0, // İç daire merkezi - tam merkez (daha yukarıdan gelen ışık için)
        128, 128, focused ? 150 : 200 // Daha odaklı ışık için daha küçük yarıçap
    );
    
    // Degrade renk durakları - merkezden dışa doğru
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)'); // Daha parlak merkez
    gradient.addColorStop(0.2, 'rgba(255, 250, 240, 0.6)'); // Daha yüksek opaklık
    gradient.addColorStop(0.4, 'rgba(200, 210, 255, 0.4)'); // Daha yüksek opaklık
    gradient.addColorStop(0.7, 'rgba(150, 170, 230, 0.2)'); // İlave degrade adımı
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Kenarlar tamamen şeffaf
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

/**
 * 3D heykel modelini yükle
 */
function createStatue() {
    // Model konteyner grubu oluştur
    model = new THREE.Group();
    scene.add(model);
    
    // GLTF yükleyici oluştur
    const loader = new GLTFLoader();

    
    // Model yükleme işlemi
    loader.load(
        'images/satyr.glb', // Model dosya yolu
        // Başarılı yükleme durumunda
        function (gltf) {
            model = gltf.scene; // Yüklenen modeli ata
            model.position.y = -2; // Y ekseninde konumlandır
            model.scale.set(0.4, 0.4, 0.4); // Ölçeği küçült (1 → 0.7)
            
            // Modelin tüm alt mesh'lerini gez ve özellikleri iyileştir
            model.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true; // Gölge oluştur
                    child.receiveShadow = true; // Gölge al
                    
                    // Malzeme ayarları
                    if (child.material) {
                        child.material.needsUpdate = true; // Malzemeyi güncelle
                        child.material.metalness = 0.3; // Orta düzeyde metalizm
                        child.material.roughness = 0.7; // Yüksek pürüzlülük - mermer benzeri
                        child.material.envMapIntensity = 1.2; // Çevre haritası yoğunluğu artırıldı (1.0 → 1.2)
                        
                        // Normal harita varsa, etkiyi güçlendir
                        if (child.material.normalMap) {
                            child.material.normalScale.set(1.5, 1.5); // Normal harita etkisini artır
                        }
                        
                        child.material.shadowSide = THREE.DoubleSide; // Her iki yüzde de gölge
                    }
                }
            });
            
            scene.add(model); // Modeli sahneye ekle
            
            isLoading = false;

        },

        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // Hata durumunda
        function (error) {
            console.error('Model yüklenirken hata oluştu:', error);
            
            // Hata durumunda kullanıcıya görsel geri bildirim - kırmızı küp göster
            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshStandardMaterial({ color: 0xff4444 }); // Kırmızı küp
            const cube = new THREE.Mesh(geometry, material);
            cube.castShadow = true;
            cube.position.y = -2;
            model = cube;
            scene.add(cube);
            
            // Hata durumunda bile yükleme ekranını kapat
            isLoading = false;
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    );
}

/**
 * Pencere boyutu değiştiğinde yeniden boyutlandırma
 * Duyarlı tasarım için önemli
 */
function onWindowResize() {
    const container = document.getElementById('3d-container');
    camera.aspect = container.clientWidth / container.clientHeight; // Kamera en/boy oranını güncelle
    camera.updateProjectionMatrix(); // Projeksiyon matrisini güncelle
    renderer.setSize(container.clientWidth, container.clientHeight); // Renderer boyutunu güncelle
}

// ... Önceki kodlar buraya gelir ...

/**
 * Yıldız dokusu oluştur
 * Yıldızlar için lens flare benzeri bir doku oluşturur
 * @returns {THREE.Texture} Oluşturulan yıldız dokusu
 */
function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Radyal degrade oluştur - merkezden dışa doğru soluklaşan parlak nokta
    const gradient = ctx.createRadialGradient(
        16, 16, 0,  // İç daire merkezi
        16, 16, 16  // Dış daire (canvas köşesine kadar)
    );
    
    // Yıldız parlaklık degrade basamakları
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)'); // Merkez: tam beyaz
    gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.25, 'rgba(200, 200, 255, 0.6)');
    gradient.addColorStop(0.5, 'rgba(150, 150, 230, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 30, 0)'); // Dış: tamamen şeffaf

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    // Yatay lens flare çizgisi ekle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(0, 14, 32, 4);
    
    // Dikey lens flare çizgisi ekle
    ctx.fillRect(14, 0, 4, 32);
    
    // Doku oluştur
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

/**
 * Gerçekçi yıldızlı arka plan oluştur
 * Daha az sayıda ama daha gerçekçi yıldızlar ile uzay hissi yaratır
 */
function createStarryBackground() {
    // Yıldız dokusu oluştur
    const starTexture = createStarTexture();
    
    // Ana yıldızlar için geometri oluştur (daha az sayıda)
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 1500; // Yıldız sayısını 7000'den 1500'e düşür
    
    // Konum, boyut ve renk için diziler
    const positions = new Float32Array(starsCount * 3);
    const sizes = new Float32Array(starsCount);
    const colors = new Float32Array(starsCount * 3);
    
    // Yıldız küresinin yarıçapı
    const radius = 80;
    
    // Yıldızları rastgele konumlara yerleştir
    for (let i = 0; i < starsCount; i++) {
        // Küre üzerinde rastgele konum ama biraz daha düzensiz dağılım
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.pow(Math.random(), 0.4) * 2 - 1); // Dağılımı değiştir
        
        // Küresel koordinatları kartezyen koordinatlara dönüştür
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        // Pozisyon dizisine ata
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        // Gerçekçi parlaklık dağılımı - çoğu yıldız sönük, az sayıda parlak
        const brightnessCurve = Math.pow(Math.random(), 2.5); // Üstel dağılım
        sizes[i] = 0.2 + brightnessCurve * 1.3; // 0.2 - 1.5 arası boyut
        
        // Daha gerçekçi yıldız rengi - sıcaklık bazlı spektrum
        // Sıcak yıldızlar (mavi/beyaz): 7000-30000K
        // Orta sıcaklık (beyaz/sarı): 5000-7000K
        // Soğuk yıldızlar (sarı/kırmızı): 2500-5000K
        const starType = Math.random();
        
        let hue, saturation, lightness;
        
        if (starType < 0.1) {
            // Sıcak mavi yıldızlar (daha nadir)
            hue = 0.6 + Math.random() * 0.05;
            saturation = 0.5 + Math.random() * 0.3;
            lightness = 0.7 + Math.random() * 0.3;
        } else if (starType < 0.4) {
            // Beyaz/mavi-beyaz yıldızlar
            hue = 0.2 + Math.random() * 0.4;
            saturation = 0.1 + Math.random() * 0.2;
            lightness = 0.8 + Math.random() * 0.2;
        } else if (starType < 0.8) {
            // Sarımsı-beyaz yıldızlar (en yaygın)
            hue = 0.1 + Math.random() * 0.05;
            saturation = 0.1 + Math.random() * 0.2;
            lightness = 0.7 + Math.random() * 0.2;
        } else {
            // Kırmızımsı/turuncu yıldızlar
            hue = 0.02 + Math.random() * 0.04;
            saturation = 0.4 + Math.random() * 0.3;
            lightness = 0.6 + Math.random() * 0.2;
        }
        
        // HSL'den RGB'ye dönüştür
        const color = new THREE.Color();
        color.setHSL(hue, saturation, lightness);
        
        // Renk dizisine ata
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    // Geometriye konumları ata
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Yıldız parçacıkları için malzeme - daha gerçekçi görünüm
    const starsMaterial = new THREE.PointsMaterial({
        size: 1.2,
        sizeAttenuation: true,
        map: starTexture,
        alphaTest: 0.15,
        transparent: true,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    
    // Yıldız parçacık sistemi oluştur
    brightStars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(brightStars);
    
    // Uzak ve çok sönük arka plan yıldızları - daha az sayıda
    const farStarsGeometry = new THREE.BufferGeometry();
    const farStarsCount = 3000; // 10000'den 3000'e düşür
    const farPositions = new Float32Array(farStarsCount * 3);
    const farSizes = new Float32Array(farStarsCount);
    const farColors = new Float32Array(farStarsCount * 3);
    const farRadius = 120;
    
    for (let i = 0; i < farStarsCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.pow(Math.random(), 0.5) * 2 - 1);
        
        const x = farRadius * Math.sin(phi) * Math.cos(theta);
        const y = farRadius * Math.sin(phi) * Math.sin(theta);
        const z = farRadius * Math.cos(phi);
        
        farPositions[i * 3] = x;
        farPositions[i * 3 + 1] = y;
        farPositions[i * 3 + 2] = z;
        
        // Daha gerçekçi boyut dağılımı - çoğu çok küçük
        farSizes[i] = 0.1 + Math.pow(Math.random(), 3) * 0.3;
        
        // Uzak yıldızların renkleri daha soluk
        const farStarType = Math.random();
        const color = new THREE.Color();
        
        if (farStarType < 0.2) {
            // Hafif mavimsi
            color.setHSL(0.6 + Math.random() * 0.1, 0.2, 0.5 + Math.random() * 0.2);
        } else if (farStarType < 0.8) {
            // Beyazımsı
            color.setHSL(0, 0 + Math.random() * 0.1, 0.6 + Math.random() * 0.2);
        } else {
            // Hafif sarımsı/kırmızımsı
            color.setHSL(0.05 + Math.random() * 0.05, 0.3, 0.5 + Math.random() * 0.2);
        }
        
        farColors[i * 3] = color.r;
        farColors[i * 3 + 1] = color.g;
        farColors[i * 3 + 2] = color.b;
    }
    
    farStarsGeometry.setAttribute('position', new THREE.BufferAttribute(farPositions, 3));
    farStarsGeometry.setAttribute('size', new THREE.BufferAttribute(farSizes, 1));
    farStarsGeometry.setAttribute('color', new THREE.BufferAttribute(farColors, 3));
    
    const farStarsMaterial = new THREE.PointsMaterial({
        size: 0.6,
        sizeAttenuation: true,
        map: starTexture,
        alphaTest: 0.1,
        transparent: true,
        vertexColors: true,
        opacity: 0.7,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    
    const farStars = new THREE.Points(farStarsGeometry, farStarsMaterial);
    scene.add(farStars);

}


/**
 * Animasyon döngüsü - her karede çağrılır
 * Modeli hafifçe döndürür ve ışık efektlerini günceller
 */
function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    
    // Zaman faktörü hesapla
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    
    // Yükleme sırasında yükleme ekranını güncelle
    if (isLoading) {
        // Yükleme doğrusal ilerliyor, ek animasyon gerekmez
        return;
    }
    
    // Model varsa hafifçe döndür
    if (model && model.rotation) {
        // Çok yavaş dönüş (her saniyede 0.05 radyan - yaklaşık 3 derece)
        model.rotation.y += delta * 0.5;
    }
    
    // Yıldızları hafifçe döndür - uzay hissi için
    if (brightStars) {
        brightStars.rotation.y += delta * 0.01;
        brightStars.rotation.x = Math.sin(elapsed * 0.03) * 0.01;
    }
    
    // Spot ışıkları hafifçe hareket ettir
    spotLights.forEach((spotLight, index) => {
        if (spotLight.light) {
            // Işık pozisyonunu orijinal konumuna göre hafifçe sallandır
            const originalPos = spotLight.light.position.clone();
            const pulseSpeed = 0.2 + index * 0.1;
            const pulseAmplitude = 0.7;
            
            // Sadece belirli bir ekseninde küçük bir salınım ekle
            if (index === 0) {
                // Ana ışık için X ekseninde salınım
                spotLight.light.position.x = originalPos.x + Math.sin(elapsed * pulseSpeed) * pulseAmplitude;
            } else if (index === 1) {
                // İkinci ışık için Y ekseninde salınım
                spotLight.light.position.y = originalPos.y + Math.sin(elapsed * pulseSpeed + 1) * pulseAmplitude;
            } else if (index === 2) {
                // Dolgu ışığı için Z ekseninde salınım
                spotLight.light.position.z = originalPos.z + Math.sin(elapsed * pulseSpeed + 2) * pulseAmplitude;
            }
            
            // Spot ışık helper'ları varsa güncelle
            if (spotLight.helper) {
                spotLight.helper.update();
            }
        }
    });
    
    // Sahneyi renderla
    renderer.render(scene, camera);
}

// Sayfanın yüklenmesi tamamlandığında başlat
window.addEventListener('load', init);

