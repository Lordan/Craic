const roles = {
	'leader' : 'leaders',
	'member' : 'members'	
};
const roleCheck = {
	'isLeader'	:	matchRole(roles.leader),
	'isMember'	:	matchRole(roles.member)
};


function matchRole(role) {
	return function (msg){
		let roleMatched = false;
		if (msg.member && msg.member.roles) {
			const memberRoles = msg.member.roles;
			for (const [key, value] of memberRoles) {
				if (value.name == role) {
						roleMatched = true;
						break;
				}
			}
		}
		return roleMatched;
	}
}

exports.roleCheck = roleCheck;
exports.roles - roles;