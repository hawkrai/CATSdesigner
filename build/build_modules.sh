export modules_path='/d/.temp/CATSdesigner/modules/'
export admin_path=$modules_path'admin'
export tests_path=$modules_path'/tests'
export subjects_path=$modules_path'/subjects'
export cp_path=$modules_path'/course-projects'

cd $admin_path

npm run build

cd $tests_path

npm run build

cd $subjects_path

npm run build

cd $cp_path

npm run build