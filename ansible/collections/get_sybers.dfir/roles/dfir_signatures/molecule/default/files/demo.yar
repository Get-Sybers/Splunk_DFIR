rule DFIR_Molecule_Marker
{
    strings:
        $a = "MOLECULE_DETECTION_MARKER"
    condition:
        $a
}
