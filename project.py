import os

def read_and_write_to_project(filename):
    with open(filename, 'r') as f:
        content = f.read()

    with open('project.txt', 'a') as project_file:
        project_file.write(f'File name: {filename}\n')
        project_file.write(content)
        project_file.write('\n')

# Current directory where the script is running
current_directory = os.path.dirname(os.path.realpath(__file__))

for root, dirs, files in os.walk(current_directory):
    for file in files:
        if file.endswith('.py') or file.endswith('.js') or file.endswith('.html') or file.endswith('.css'):
            filepath = os.path.join(root, file)
            read_and_write_to_project(filepath)
