### Build BackEnd ###

$server = "server"
$client = "client"
$app_root = "../"

# Remove existing production folder
Remove-Item build -Recurse -Force -ErrorAction Ignore

# Transpile .ts to .js
Set-Location $server
tsc --sourceMap false

# Move the backend build
Set-Location $app_root
Move-Item $server/build build

# Copy env file
Copy-Item $server/util/.env build/.env

### Bundle FrontEnd ###

# Create the directory for React
mkdir -p build/public/

# Navigate to the react directory
Set-Location $client

# Build React code
yarn build

# Move the contains to the build/ dir
Set-Location $app_root
Move-Item $client/build build/public/index
