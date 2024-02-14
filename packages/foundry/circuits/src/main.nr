use dep::std;

fn main(secret : Field, nullifier : Field, treeIndex : u64, hashpath : [Field; 10], leaf : Field, 
        root : pub Field) {
    let computed_leaf = std::hash::poseidon::bn254::hash_2([secret, nullifier]);
    assert(computed_leaf == leaf);

    let mut index = treeIndex;
    let mut computed_root = leaf;

    for i in 0..hashpath.len() {
        if (hashpath[i] != 0) {
            if (index % 2 == 0) {
                computed_root = std::hash::poseidon::bn254::hash_2([hashpath[i], computed_root]);
                index = (index - 2) / 2;
            } else {
                computed_root = std::hash::poseidon::bn254::hash_2([computed_root, hashpath[i]]);
                index = (index - 1) / 2;
            }
        }
    };
    assert(computed_root == root);
}
