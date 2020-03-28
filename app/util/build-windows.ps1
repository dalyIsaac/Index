### Build BackEnd ###

$server = "packages/server"
$client = "packages/client"
$app_root = "../../"

# Remove existing production folder
Remove-Item build -Recurse -Force -ErrorAction Ignore

# Transpile .ts to .js
cd $server
tsc --sourceMap false

# Move the backend build
pwd
cd $app_root
mv $server/build build

# Copy env file
cp $server/util/.env build/.env

### Bundle FrontEnd ###

# Create the directory for React
mkdir -p build/public/

# Navigate to the react directory
cd $client

# Build React code
yarn build

# Move the contains to the build/ dir
cd $app_root
mv $client/build build/public/index
