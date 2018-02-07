
ENV['ENV'] = "dev"
ENV['SITE'] = "8be50dbc-4463-43b5-bd18-d83046623820"


# The absolute path to the root directory of the project. Both Drupal VM and
# the config file need to be contained within this path.
ENV['DRUPALVM_PROJECT_ROOT'] = "#{__dir__}"
# The relative path from the project root to the config directory where you
# placed your config.yml file.
ENV['DRUPALVM_CONFIG_DIR'] = "drupalvm"
# The relative path from the project root to the directory where Drupal VM is located.
ENV['DRUPALVM_DIR'] = "vendor/geerlingguy/drupal-vm"

# Load the real Vagrantfile
load "#{__dir__}/#{ENV['DRUPALVM_DIR']}/Vagrantfile"

Vagrant.configure(2) do |config|
    config.vm.provider "virtualbox" do |v|
        v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    end
    config.ssh.forward_agent    = true
    config.ssh.insert_key       = false
    config.ssh.private_key_path =  ["~/.vagrant.d/insecure_private_key","~/.ssh/id_rsa"]

    config.vm.provision "file", source: "~/.ssh/id_rsa", destination: "/home/vagrant/.ssh/id_rsa"
      config.vm.provision "shell",
          inline: "chmod 600 /home/vagrant/.ssh/id_rsa"

    config.vm.provision :shell, privileged: false do |s|
      ssh_pub_key = File.readlines("#{Dir.home}/.ssh/id_rsa.pub").first.strip
      s.inline = <<-SHELL
         echo #{ssh_pub_key} >> /home/$USER/.ssh/authorized_keys
      SHELL
    end

    config.vm.provision "shell", inline: "echo \"export ENV=https://proxy.somedomain.com:3128\" >> /etc/profile.d/myvars.sh", run: "always"
end
