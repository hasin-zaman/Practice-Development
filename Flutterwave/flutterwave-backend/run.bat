@echo off
setlocal

:: === Set your DB secrets here ===
set CLIENT_ID=42988a24-2f58-4820-b35a-7d93e0d6e8a0
set CLIENT_SECRET=qA8Qpo3ztCGKFcLcSR76k7sQv9yGP1kY
set ENCRYPTION_KEY=uJ31e7wKRBzgpIVf2J0IcUDIojMzwBLj7ial3jfknzo=

:: Run the Spring Boot app using Maven
echo Starting Goalzone...
mvn spring-boot:run

endlocal