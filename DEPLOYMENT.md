# Hướng dẫn Deploy — An Toàn Giao Thông

## Tổng quan kiến trúc

```
[Vercel] Next.js frontend  ──►  [GCP e2-micro] Spring Boot backend (Docker)
                                               │
                                        H2 file DB + uploads
                                     ./atgt_backend/data/ (bind mount)
```

- **Frontend**: Vercel (free) — tự động deploy khi push lên GitHub
- **Backend**: Google Cloud Compute Engine e2-micro (Always Free)
- **Database**: H2 file mode — lưu trên disk VM, không mất khi restart container

---

## Phần 1 — Chạy local (development)

### Yêu cầu
- Java 21 (Corretto hoặc Temurin)
- Node.js 18+
- Docker Desktop (optional, nếu muốn chạy qua Docker)

### Chạy backend (cách 1 — Java trực tiếp)
```bash
cd atgt_backend
./mvnw package -DskipTests
"C:\Users\hoang\.jdks\corretto-21.0.10\bin\java.exe" -jar target/atgt-0.0.1-SNAPSHOT.jar
```
Backend chạy tại: http://localhost:8086

### Chạy backend (cách 2 — Docker)
```bash
# Từ thư mục gốc (có docker-compose.yml)
docker compose up -d --build backend

# Xem log
docker logs -f atgt-backend

# Dừng
docker compose down
```

### Chạy frontend
```bash
cd gdgt_fe
npm install
npm run dev
```
Frontend chạy tại: http://localhost:3000

### Lưu ý data local
- DB file: `atgt_backend/data/atgt.mv.db`
- Uploads: `atgt_backend/data/uploads/`
- Thư mục `atgt_backend/data/` được **gitignore** — không commit lên GitHub
- Khi chạy Java trực tiếp trên Windows, uploads lưu tại `C:\app\data\uploads\`
  → Nếu switch sang Docker, copy thủ công vào `atgt_backend/data/uploads/`

---

## Phần 2 — Deploy lên GCP (production)

### 2.1 Yêu cầu
- Google Cloud account có billing account linked (cần thẻ để xác minh, nhưng **không bị charge** nếu ở trong free tier)
- `gcloud` CLI đã cài: https://cloud.google.com/sdk/docs/install

### 2.2 Setup GCP lần đầu (chỉ làm 1 lần)

**Đăng nhập và chọn project:**
```powershell
gcloud init
# Chọn project có billing enabled (ví dụ: educonnect-eb7c6)
```

**Enable Compute Engine API:**
```powershell
gcloud services enable compute.googleapis.com --project=educonnect-eb7c6
```

**Tạo VM e2-micro (Always Free):**
```powershell
gcloud compute instances create atgt-backend --project=educonnect-eb7c6 --machine-type=e2-micro --zone=us-central1-a --image-family=debian-12 --image-project=debian-cloud --boot-disk-size=20GB --tags=http-server
```

> ⚠️ **Bắt buộc** dùng `e2-micro` + zone `us-central1-a/us-east1-*/us-west1-*` để được free.
> Nếu dùng machine type khác hoặc zone khác → **có thể bị tính tiền**.

**Mở firewall port 8086:**
```powershell
gcloud compute firewall-rules create allow-8086 --project=educonnect-eb7c6 --allow=tcp:8086 --target-tags=http-server --direction=INGRESS
```

### 2.3 Cài đặt môi trường trên VM (chỉ làm 1 lần)

**SSH vào VM:**
```powershell
gcloud compute ssh atgt-backend --zone=us-central1-a --project=educonnect-eb7c6
```

**Cài Docker và Git:**
```bash
sudo apt install -y ca-certificates curl gnupg git
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian bookworm stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update && sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

**Kiểm tra:**
```bash
docker --version
docker compose version
git --version
```

### 2.4 Deploy lần đầu

```bash
# Clone repo
cd ~
git clone https://github.com/Hoang130203/antoangiaothong2026.git
cd antoangiaothong2026

# Tạo thư mục data
mkdir -p atgt_backend/data/uploads

# Chạy backend (thay IP thực của VM)
APP_BASE_URL=https://atgt-hoang.duckdns.org docker compose up -d --build backend

# Kiểm tra
docker ps
curl http://localhost:8086/actuator/health
```

**Kết quả mong đợi:**
```json
{"status":"UP"}
```

### 2.5 Cập nhật sau khi có thay đổi code

```bash
# SSH vào VM
gcloud compute ssh atgt-backend --zone=us-central1-a --project=educonnect-eb7c6

# Trên VM:
cd ~/antoangiaothong2026
git pull origin main
APP_BASE_URL=https://atgt-hoang.duckdns.org docker compose up -d --build backend
```

### 2.6 Cấu hình Frontend (Vercel)

Vào **Vercel Dashboard → Project → Settings → Environment Variables**, thêm:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://atgt-hoang.duckdns.org` |

Sau đó **Redeploy** project trên Vercel.

---

## Phần 3 — Quản lý thường ngày

### Xem log backend
```bash
docker logs -f atgt-backend
# Thoát: Ctrl+C
```

### Restart backend
```bash
docker compose restart backend
```

### Dừng backend
```bash
docker compose down
```

### Khởi động lại (sau khi VM reboot)
```bash
# Backend tự start nhờ restart: unless-stopped trong docker-compose.yml
# Kiểm tra:
docker ps
```

### Xem dung lượng disk
```bash
df -h
du -sh ~/antoangiaothong2026/atgt_backend/data/
```

---

## Phần 4 — Backup data

Data quan trọng nằm ở `~/antoangiaothong2026/atgt_backend/data/`:
- `atgt.mv.db` — toàn bộ database
- `uploads/` — ảnh đã upload

**Backup thủ công từ máy local:**
```powershell
# Download về máy
gcloud compute scp --recurse atgt-backend:~/antoangiaothong2026/atgt_backend/data ./backup-data --zone=us-central1-a --project=educonnect-eb7c6
```

**Restore:**
```powershell
gcloud compute scp --recurse ./backup-data atgt-backend:~/antoangiaothong2026/atgt_backend/data --zone=us-central1-a --project=educonnect-eb7c6
```

---

## Phần 5 — Giới hạn free tier

| Tài nguyên | Giới hạn free | Ghi chú |
|---|---|---|
| e2-micro instance | 1 cái | Chỉ tại us-central1, us-east1, us-west1 |
| Persistent disk HDD | 30 GB/tháng | Đang dùng 20GB |
| Network egress | 1 GB/tháng | Xuất đi Bắc Mỹ |
| Snapshot storage | 5 GB/tháng | Nếu tạo snapshot |

**Set budget alert để tránh bất ngờ:**
```powershell
gcloud billing budgets create --billing-account=011643-95E06C-F53C43 --display-name="ATGT Budget Alert" --budget-amount=1USD --threshold-rule=percent=50 --threshold-rule=percent=100
```

---

## Phần 6 — Troubleshooting

### Backend không start
```bash
docker logs atgt-backend --tail=50
```

### Port 8086 không truy cập được từ ngoài
```bash
# Kiểm tra firewall rule
gcloud compute firewall-rules list --project=educonnect-eb7c6

# Kiểm tra container đang bind đúng port
docker ps
```

### Hết RAM (e2-micro chỉ có 1GB)
Thêm vào `docker-compose.yml` trong phần `environment`:
```yaml
- JAVA_TOOL_OPTIONS=-Xmx256m -Xms128m
```
Rồi `docker compose up -d --build backend`

### VM bị tắt do GCP maintenance
```bash
# Bật lại từ máy local
gcloud compute instances start atgt-backend --zone=us-central1-a --project=educonnect-eb7c6
```

### Xem IP hiện tại của VM
```powershell
gcloud compute instances describe atgt-backend --zone=us-central1-a --project=educonnect-eb7c6 --format="get(networkInterfaces[0].accessConfigs[0].natIP)"
```
