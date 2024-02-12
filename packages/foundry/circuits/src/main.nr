use dep::std;

fn main(secret : Field, index : Field, hashpath : [Field; 40], 
    token : pub Field, amount : pub Field, nullifier : pub Field, root : pub Field) {
    let leaf = std::hash::pedersen_hash([secret, nullifier, token, amount]);
    let merkle_root = std::merkle::compute_merkle_root(leaf, index, hashpath);
    assert(merkle_root == root);
}
