use dep::std;

fn main(secret : Field, leaf : Field, index : u64, hash_path : [Field; 10], 
        nullifier : pub Field, root : pub Field) {
    let computed_leaf = std::hash::poseidon::bn254::hash_2([secret, nullifier]);
    assert(computed_leaf == leaf);

    let mut treeIndex = index;
    let mut computed_root = leaf;

    for i in 0..hash_path.len() {
        if (hash_path[i] != 0) {
            if (treeIndex % 2 == 0) {
                computed_root = std::hash::poseidon::bn254::hash_2([hash_path[i], computed_root]);
                treeIndex = (treeIndex - 2) / 2;
            } else {
                computed_root = std::hash::poseidon::bn254::hash_2([computed_root, hash_path[i]]);
                treeIndex = (treeIndex - 1) / 2;
            }
        }
    };
    assert(computed_root == root);
}
